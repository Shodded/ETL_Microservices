const BaseDataModel = require("./BaseData");
const IntegrationModel = require("./models/integration.model");

class IntegrationData extends BaseDataModel {
  constructor(dbConnector) {
    super()
    this.entityModel = IntegrationModel(dbConnector.mongoose)
  }
}

module.exports = IntegrationData