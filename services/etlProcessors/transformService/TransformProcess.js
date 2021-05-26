const _ = require('lodash')
const QueueSender = require("../../../core-lib/utils/QueueSender")
const preDefinedFunctions = require('./preDefinedFunctions')
const IntegrationCacheManager = require('../etl-lib/cacheManager/IntegrationCacheManager')
const { SourceObject, ProcessType, TransformFinalStatus } = require("../etl-lib/models/transformEnums")
const config = require('./config.json')
const queueSender = new QueueSender(config.queueSender.connectionString)


class TransformProcess{
    constructor(dbConnection) {
        this.integrationCacheManager = new IntegrationCacheManager(dbConnection)
    }

    processHandler = async (dataToTransform) => {
        if (dataToTransform && dataToTransform.integrationId != null) {
            // get transformation by ID
            let integrationId = dataToTransform.integrationId
            console.log(`Integration Id in transform process ${integrationId}`);

            let integration = await this.integrationCacheManager.getById(integrationId)

            if (!integration || !integration.transform) {
                console.error(`Integration id is missing, id=${integrationId}`);
                return
            }

            let entityType = integration.entity
            let transformation = integration.transform
            
            let bulkUpsert = []

            // Transform objects on the current message queue
            for (let jsonSingleData of dataToTransform.data) {
                try {
                    let jsonObj = JSON.parse(JSON.stringify(jsonSingleData))
                    let transformedResult = await handleTransformation(transformation, jsonObj)

                    if (transformedResult.warningLogs > 0)
                        console.warn(`IntegrationId=${integrationId}, Issue transforming object, details=${warning_log}, original object=${JSON.stringify(jsonOriginalObj)}`)

                    if (transformedResult.status == TransformFinalStatus.ADD_TO_BULK) {
                        bulkUpsert.push(transformedResult.result)
                    }
                }
                catch (err) {
                    console.log(`Cannot transform ${entityType} on integration ${integrationId}, object: ${JSON.stringify(jsonObj)} error details: ${err}`)
                }
            }

            queueSender.sendMessage({ integrationId: integrationId, data: bulkUpsert })
        }
        else
            console.error(`Transform integration id is missing`)

        return
    }

}

function getDirectPath(sourceObj, sourcePath) {
    let result = _.get(sourceObj, sourcePath)
    return result
}

async function getCustomFunction(originalObject, targetObject, tempObject, functionToEvaluate) {
    let result = await functionToEvaluate(originalObject, targetObject, tempObject, preDefinedFunctions)
    return result
}

async function handleTransformation(transformation, jsonOriginalObj) {
    console.log(`Start transfering object=${JSON.stringify(jsonOriginalObj)}`)
    let warningLogs = []
    let tempObject = {}
    let destinationObject = {}
    let counter = 1


    for (let transformField of transformation.schemaDefinition) {
        try {

            let objectOptions = {
                "dest": destinationObject,
                "temp": tempObject,
                "original": jsonOriginalObj
            }

            validateTransform(transformField, objectOptions, counter)
            let sourceObj = transformField.sourceObj && objectOptions[transformField.sourceObj] ? objectOptions[transformField.sourceObj] : {}
            let targetObj = objectOptions[transformField.targetObj]
            let targetField = transformField.targetField
            let result

            switch (transformField.processType) {
                case ProcessType.DIRECT_PATH: {
                    result = getDirectPath(sourceObj, transformField.sourcePath)
                    break
                }
                case ProcessType.EXPRESSION_FUNCTION:
                case ProcessType.CUSTOM_FUNCTION: {
                    let processFunction = transformField.convertInfo[transformField.processType]
                    result = await getCustomFunction(jsonOriginalObj, targetObj, tempObject, processFunction.evaluate)
                    break
                }
                /*case ProcessType.PRE_DEFINED: {
                    preDefined = transformField[ProcessType.PRE_DEFINED]
                    result = await getPreDefined(preDefined)
                    break
                }*/
                default:
                    throw new Error(`ProcessType is wrong, processType=${transformField.processType}`)
            }

            // consider to add format change here

            targetObj[targetField] = result

            counter++
        }
        catch (err) {
            // optional to add a distinguish between a mandatory field (raise error and stop the process) between just a warning convesions  
            warningLogs.push(`entry=${counter}, details=${err}`)
        }
    }

    return { result: destinationObject, status: TransformFinalStatus.ADD_TO_BULK, warningLogs: warningLogs }
}

function validateTransform(transformField, objectOptions) {
    if (!transformField.targetObj || !objectOptions[transformField.targetObj])
        throw new Error(`SchemaDefinition targetObj option is missing, value=${transformField.targetObj}`)
    else if (objectOptions[transformField.targetObj] == SourceObject.ORIGINAL)
        throw new Error(`SchemaDefinition targetObj cannot target to original`)

    if (!transformField.targetField)
        throw new Error(`SchemaDefinition targetField is missing, value=${transformField.targetObj}`)

    if (transformField.sourceObj && !objectOptions[transformField.sourceObj])
        throw new Error(`SchemaDefinition sourceObj option is missing, value=${transformField.sourceObj}`)

    if (!transformField.targetField)
        throw new Error(`SchemaDefinition targetField is missing`)
}


module.exports ={ TransformProcess }


/*
async function getPreDefined(preDefined) {
    let args = []

    for (argumentToPass of preDefined.args) {
        switch (argumentToPass) {
            case ('source'): {
                let result = getDirectPath(argumentToPass.sourceObj, argumentToPass.sourcePath)
                args.push(result)
                break
            }
            case ('literal'): {
                args.push(argumentToPass.value)
                break
            }
            case ('empty'): {
                args.push(null)
                break
            }
            default:
                throw new Error('')
        }
    }

    // evaluate the methods here
}*/