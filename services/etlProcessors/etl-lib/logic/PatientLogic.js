const PatientData = require("../data/PatientData");
const BaseEntityLogic = require("./BaseEntityLogic");


class PatientLogic extends BaseEntityLogic{
  constructor(dbConnector) {
    super()
    this.entityData = new PatientData(dbConnector)
  }
}


module.exports = PatientLogic