const _ = require('lodash')
const QueueSender = require("../../../core-lib/utils/QueueSender")
const IntegrationCacheManager = require('../etl-lib/cacheManager/IntegrationCacheManager')
const { ExtractionStreamSender } = require("./util/ExtractionStreamSender")
const extractStrategies = require('./extractStrategy/index')
const config = require('./config.json')
const queueSender = new QueueSender(config.queueSender.connectionString)


class ExtractProcess {
    constructor(dbConnection) {
        this.integrationCacheManager = new IntegrationCacheManager(dbConnection)
    }

    processHandler = async (dataToTransform) => {
        let integrationId
        if (dataToTransform && dataToTransform.integrationId != null) {
            try {
                // get transformation by ID
                integrationId = dataToTransform.integrationId
                console.log(`Start IntegrationId=${integrationId} in extract process`);

                let integration = await this.integrationCacheManager.getById(integrationId)

                if (!integration || !integration.transform) {
                    console.error(`Integration id is missing, id=${integrationId}`);
                    return
                }

                let extraction = integration.extract
                let ExtractStrategyConstructor = extractStrategies(extraction.type)

                if (!ExtractStrategyConstructor) {
                    console.error(`Integration strategy not found, id=${integrationId}`);
                    return
                }

                let streamSender = new ExtractionStreamSender(queueSender, integrationId, extraction.sourceFormat, extraction.getDeepDepthPath)
                let extractStrategy = new ExtractStrategyConstructor(streamSender)
                extractStrategy.setInitArgs(extraction.extractInfo)
                await extractStrategy.process()
            }
            catch (err) {
                console.error(`Something went wrong whille extracting data for integrationId=${integrationId}, details=${err}`)
            }
        }
        else
            console.error(`Transform integration id is missing`)

        return
    }
}


module.exports = { ExtractProcess }

