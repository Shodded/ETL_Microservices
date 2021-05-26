const fs = require('fs')
var csv = require("csvtojson")
const StringDecoder = require('string_decoder').StringDecoder;
const decoder = new StringDecoder('utf8');
const { ExtractBase } = require("./ExtractBase")
const os = require('os')
const spreadDirSign = os.platform() === 'win32' ? "\\" : "/"

class CsvToJsonFile extends ExtractBase {
    constructor(streamSender) {
        super(streamSender)
    }

    setupProcess = async () => {
        this.delimiter = this.args.delimiter || ','
        this.fileName = this.args.fileName
        this.path = this.args.path
    }

    _getFullPath() {
        return `${this.path}${spreadDirSign}${this.fileName}`
    }

    invokeAction = async () => {
        let streamSender = this.streamSender
        let currentResult = []
        return new Promise((resolve, reject) => {
            fs.createReadStream(this._getFullPath())
                .pipe(csv({ delimiter: this.delimiter }))
                .on('error', function (err) {
                    console.error(`Error when working on csvToJson stream ${err}`);
                    reject(err)
                })
                .on('data', async function (csvToJsonRow) {
                    try {
                        let stringifyJson = decoder.write(csvToJsonRow);
                        let resultJson = {}
                        resultJson = typeof stringifyJson === "string" ? JSON.parse(stringifyJson) : stringifyJson
                        
                        currentResult.push(resultJson)
                        let hasSent = await streamSender.upstream(resultJson)
                        if (hasSent)
                            currentResult = []
                    }
                    catch (err) {
                        console.error(`error occured in CsvToJson stream ${err}`)
                    }
                })
                .on('end', async function () {
                    console.log('ended the csv reading stream');
                    this.hasMore = false // get out of the base while loop
                    resolve(currentResult)
                })
        })
    }

    afterAction = async (dataResult = null) => {
        this.hasMore = false
    }
}


exports.CsvToJsonFile = CsvToJsonFile;