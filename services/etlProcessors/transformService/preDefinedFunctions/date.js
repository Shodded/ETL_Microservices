
const moment = require('moment')
const ISO_DATE_FORMAT = "YYYY-MM-DD"

function format(dateString, currentFormat, targetFormat = null, strictMode = false){
    let result = moment(dateString, currentFormat, strictMode).format(targetFormat || ISO_DATE_FORMAT)
    return result
}

module.exports = {format}