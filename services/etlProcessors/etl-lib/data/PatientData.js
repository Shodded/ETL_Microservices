const BaseDataModel = require("./BaseData");
const PatientModel = require("./models/patient.model");


class PatientDataModel extends BaseDataModel{
  constructor(dbConnector) {
    super()
    this.entityModel = PatientModel(dbConnector.mongoose)
  }
}

module.exports = PatientDataModel