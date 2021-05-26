const querystring = require("querystring")
const IntegrationData = require("../data/IntegrationData");
const { ProcessType } = require("../models/transformEnums")


class IntegrationLogic {
  constructor(dbConnector) {
    this.entityData = new IntegrationData(dbConnector)
  }

  // Find a single integration with an id
  findOne = async (id) => {
    let error_log = []
    let integrationResult = await this.entityData.findOne(id)
    let counter = 1

    for (let convertion of integrationResult.transform.schemaDefinition) {
      try {
        if ([ProcessType.CUSTOM_FUNCTION, ProcessType.EXPRESSION_FUNCTION].includes(convertion.processType)) {
          // Consider using query unescape here querystring.unescape(functionString)
          let unEscapedFunctionString = querystring.unescape(convertion.convertInfo[convertion.processType].evaluate);

          let fn = eval(`(async function(original, dest, temp, fn){${convertion.processType === ProcessType.EXPRESSION_FUNCTION ? "return" : ""} ${unEscapedFunctionString}})`)

          if (!isFunctionObject(fn))
            throw new Error(`Error due to that customFunction is not a type of 'function'`);

            convertion.convertInfo[convertion.processType].evaluate = fn
        }
      } catch (err) {
        let error_message = `Error when trying to evaluate function for entry=${counter}`
        error_log.push(error_message)
      }

      counter++
    }

    if (error_log > 0) {
      let error_message = `Issue evaluate integrationId=${id}, details=${error_log}`
      console.error(error_message)
      throw new Error(error_message)
    }

    return integrationResult
  }
}

const isFunctionObject = (value) => {
  return value != null && typeof value === 'function';
};


module.exports = IntegrationLogic