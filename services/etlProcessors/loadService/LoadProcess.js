const QueueSender = require("../../../core-lib/utils/QueueSender")
const IntegrationCacheManager = require('../etl-lib/cacheManager/IntegrationCacheManager')
const businessLogic = require('../etl-lib/logic/index')
const config = require('./config.json')
const queueSender = new QueueSender(config.queueSender.connectionString)


class LoadProcess {
    constructor(dbConnection) {
        this.integrationCacheManager = new IntegrationCacheManager(dbConnection)
        this.businessLogic = businessLogic(dbConnection)
    }

    processHandler = async (dataToLoad) => {
        if (dataToLoad && dataToLoad.integrationId != null) {
            // get load by ID
            let integrationId = dataToLoad.integrationId
            console.log(`Integration Id in load process ${integrationId}`);

            let integration = await this.integrationCacheManager.getById(integrationId)

            if (!integration || !integration.transform) {
                console.error(`Integration id is missing, id=${integrationId}`);
                return
            }

            let entityType = integration.entity
            let load = integration.load
            let siteId = integration.siteId

            if (!entityType || !this.businessLogic[entityType]) {
                let error_message = `Not exist entityType=${entityType} in integrationId=${integrationId} on load phase`
                console.error(error_message)
                throw new Error(error_message)
            }

            let entityLogic = this.businessLogic[entityType]
            let bulkUpsertList = []

            // Transform objects on the current message queue
            for (let jsonSingleLoad of dataToLoad.data) {
                try {
                    let jsonObj = JSON.parse(JSON.stringify(jsonSingleLoad))

                    let match = setMatch(jsonObj, load.constraintFields || [])

                    bulkUpsertList.push({ match: match, entity: jsonObj })

                    console.log(`Success set entity=${entityType} to load object=${JSON.stringify(jsonObj)}`)
                }
                catch (err) {
                    console.error(`Cannot set entity ${entityType} object on load phase 
                        integrationId=${integrationId}, object=${JSON.stringify(jsonObj)} error details=${err}`)
                }
            }

            try {
                let result = await entityLogic.bulkUpsert(integrationId, bulkUpsertList, siteId)
                console.log(`Success bulk upsert on ${integrationId}`)
            }
            catch (err) {
                console.error(`Cannot bulk upsert entity ${entityType} object on load phase 
                        integrationId=${integrationId}, error details=${err}`)
            }

            // queueSender.sendMessage({ integrationId: integrationId, context: 'finishedLoad' }) set info for the next update process.. 
        }
        else
            console.error(`integration id is missing on load`)
    }
}


function setMatch(jsonObject, constraintFields = null) {
    // consider adding json Object default match per entity type...
    try {
        let matchResult = {}
        if (constraintFields) {
            constraintFields.forEach((field) => {
                matchResult[field] = jsonObject[field]
            })
        }
        return matchResult
    }
    catch (err) {
        throw new Error(`Issue set match to object ${JSON}, error:${err}`)
    }
}

function validateEntity(entity, entityType) {
    // add validation per entity with joi
    // treatment, patient...
}


module.exports = { LoadProcess }
