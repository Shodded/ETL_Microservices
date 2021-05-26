
const IntegrationLogic = require("./IntegrationLogic");
const TreatmentLogic = require("./TreatmentLogic");
const PatientLogic = require("./PatientLogic");


module.exports = dbConnector => {
  let result = {
    "integration": new IntegrationLogic(dbConnector),
    "treatment": new TreatmentLogic(dbConnector),
    "patient": new PatientLogic(dbConnector)
  }

  return result
}