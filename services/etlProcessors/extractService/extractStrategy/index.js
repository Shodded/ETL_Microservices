const { CsvToJsonFile } = require('./CsvToJsonFile')

module.exports = strategyOption => {
    let extractStrategy = {
        "csvToJsonFile": CsvToJsonFile
    }

    return extractStrategy[strategyOption] || null
}