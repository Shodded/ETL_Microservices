'use strict'
const delay = require("delay");
const logger = console // change to a real logger
const QueueReceiver = require("./QueueReciever");
const queueProcess = {
  "shutdownInterval": 10000,
  "fetchDelayInterval": 500 // todo: export options to an external config 
}

/**
 * @param  {Promise}  async function to handle messages from queue invoked as processFunc(messages)
 */
module.exports = class QueueManager {
  constructor(processQueue, conn) {
    this._processingEnabled = true
    this._isProblem = false
    this.processQueue = processQueue
    this.queueReceiver = new QueueReceiver(conn)
  }

  auditFailure(isCurrProblem, err) {
    this._isProblem = isCurrProblem
    if (this._isProblem)
      logger.error("Queue Receiver - an error has occured during message processing" + JSON.stringify(err));
    else
      logger.info("Queue Receiver - is back to function");
  }

  async init() {
    gracefullShutdown();
    await this.start();
  }

  async start() {
    try {
      while (this._processingEnabled == "true" || this._processingEnabled == true) {
        try {
          const message = await this._receive();
          this._isProblem === true ? this.auditFailure(false) : false
          if (message) {
            let messageParsed = JSON.parse(JSON.stringify(message))
            await this._processHandle(messageParsed);
          }
          await delay(queueProcess.fetchDelayInterval);
        } catch (err) {
          if (!this._isProblem) {
            this.auditFailure(true, err)
          }
        }
      }
      logger.error("Queue Processor Execution is stopped");
    } catch (e) {
      logger.error("fatal error: execution stopped");
    }
  }

  async stop() {
    logger.info("Queue is stopping - (gracefull shutdown started)" + + new Date().toISOString());
    this._processingEnabled = false;
    await delay(queueProcess.shutdownInterval);
    logger.info("Queue is stopping - (gracefull shutdown ended) " + new Date().toISOString());
  }

  async _processHandle(messages) {
    await this.processQueue.processHandler(messages);
  }

  async _receive() {
    return await this.queueReceiver.fetchBulk()
  }
}

//gracefull shutdown
const gracefullShutdown = () => {
  process.on('SIGTERM', async () => {
    await stop();
  });

  process.on('SIGQUIT ', async () => {
    await stop();
  });

  process.on('SIGINT', async () => {
    await stop();
  });
}