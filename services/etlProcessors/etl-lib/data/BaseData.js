class BaseData {
  constructor() {
  }

  findOne = async (id) => {
    let result = await this.entityModel.findById(id)
    return result ? result.toJSON() : null
  }

  bulkUpsert = async (integrationId, entitiesToUpdate, siteId) => {
    if (!siteId) {
      throw new Error('siteId is missing')
    }
    if (!integrationId) {
      throw new Error('integrationId is missing')
    }
    let result

    try {
      var bulk = this.entityModel.collection.initializeOrderedBulkOp();

      for (let entityUpsertInfo of entitiesToUpdate) {
        // siteId is binded per client, it cannot be override due to clients multitanancy scope
        entityUpsertInfo.match['site_Id'] = siteId
        bulk.find({ ...entityUpsertInfo.match }).upsert().updateOne(
          { $set: entityUpsertInfo.entity })
        } 

      result = await bulk.execute()
    }
    catch (err) {
      let error_message = `Issue bulkUpsert integrationId=${integrationId}, details=${err}`
      console.error(error_message)
      throw new Error(error_message)
    }

    return result
  }
}

module.exports = BaseData
