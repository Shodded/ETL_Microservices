const TransformFinalStatus = {
    ADD_TO_BULK: "addToBulk"
    // FILTER_OUT = "transformFilterOut" // This part is for future purposes 
};

const SourceObject = {
    ORIGINAL: "original",
    DESTINATION: "dest",
    TEMPORARY: "temp"
};

const ProcessType = {
    DIRECT_PATH: "directPath",
    PRE_DEFINED: "preDefined", // For future purposes,
    CUSTOM_FUNCTION: "customFunction" ,
    EXPRESSION_FUNCTION: "expressionFunction"
};

module.exports = {ProcessType, SourceObject, TransformFinalStatus};
