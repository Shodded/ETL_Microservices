const BaseDataModel = require("./BaseData");
const TreatmentModel = require("./models/treatment.model");


class TreatmentDataModel extends BaseDataModel{
  constructor(dbConnector) {
    super()
    this.entityModel = TreatmentModel(dbConnector.mongoose)
  }
}

module.exports = TreatmentDataModel
