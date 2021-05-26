const QueueManager = require('../../../core-lib/utils/QueueManager')
const config = require('./config.json')
const { MongoDbConnector } = require("../etl-lib/data/connectors/MongoDbConnector")
const dbConnector = new MongoDbConnector(config.mongoDB.connectionString);
const { ExtractProcess } = require("./ExtractProcess")
let transformProcess = new ExtractProcess(dbConnector.db)

let queueManager = new QueueManager(transformProcess, config.queueReceiver.connectionString)

const init = async () => {
    await dbConnector.openConnection()
    console.log('Extract-service is on!')
    await queueManager.init()
}

init()