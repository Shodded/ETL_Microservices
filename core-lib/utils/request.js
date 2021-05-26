const axios = require('axios');

exports.get = async (urlPath, dataQuery, header = null, baseUrlPath = null) => {
    let result = await request('get', urlPath, dataQuery, null, header, baseUrlPath)
    return result
}

exports.post = async (urlPath, header = null, body = null, baseUrlPath = null) => {
    let result = await request('post', urlPath, null, body, header, baseUrlPath)
    return result
}

request = async (methodRequest, urlPath, dataQuery = null, body = null, header = null, baseUrlPath = null) => {
    let result = {}
    let headerDefault = {
        'content-type': 'application/json',
    }

    let config = {
        baseURL: baseUrlPath,
        method: methodRequest,
        url: urlPath,
        headers: header || headerDefault
    }

    if (dataQuery) {
        config.params = dataQuery
    }

    if (body) {
        config.data = body
    }

    try {
        result = await axios(config);
    }
    catch (e) {
        if (e.response && e.response.status){
            result.status = e.response.status
            result.data = e.response.data
        }
        else
            console.error('Error while making a request: ' + JSON.stringify(e))
        //throw new Error(`Couldn't make request, detail: ` + e.message)
    }

    return result
}