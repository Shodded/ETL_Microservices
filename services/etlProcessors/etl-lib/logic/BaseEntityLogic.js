class BaseLogicEntity {
  constructor() {
  }

  async bulkUpsert(integrationId, jsonEntities, siteId){
    let result = await this.entityData.bulkUpsert(integrationId, jsonEntities, siteId)
    return result
  }
}

module.exports = BaseLogicEntity