const TreatmentData = require("../data/TreatmentData")
const BaseEntityLogic = require("./BaseEntityLogic")


class TreatmentLogic extends BaseEntityLogic{
  constructor(dbConnector) {
    super()
    this.entityData = new TreatmentData(dbConnector)
  }
}


module.exports = TreatmentLogic