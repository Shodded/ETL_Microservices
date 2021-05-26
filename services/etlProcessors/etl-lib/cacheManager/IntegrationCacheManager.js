const IntegrationData = require('../logic/IntegrationLogic')
let localCache = {}

// note: This is not a real cache manager, change to a real with subscription PubSub for real updates
// todo: Option to add base object of the cache manager

module.exports = class Integration {
    constructor(dbConnector) {
        this.integrationData = new IntegrationData(dbConnector)
    }

    getById = async (integrationId) => {
        if (integrationId != null && localCache[integrationId])
            return localCache[integrationId]

        // option of using a redis meta data cache before reaching the DB

        let result = await this.integrationData.findOne(integrationId)
        return result
    }
}