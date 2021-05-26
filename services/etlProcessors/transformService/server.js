const QueueManager = require('../../../core-lib/utils/QueueManager')
const config = require('./config.json')
const { MongoDbConnector } = require("../etl-lib/data/connectors/MongoDbConnector")
const dbConnector = new MongoDbConnector(config.mongoDB.connectionString);
const { TransformProcess } = require("./TransformProcess")
let transformProcess = new TransformProcess(dbConnector.db)

let queueManager = new QueueManager(transformProcess, config.queueReceiver.connectionString)

const init = async () => {
    await dbConnector.openConnection()
    console.log('Transform-service is on!')
    await queueManager.init()
}

init()