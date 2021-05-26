const maxBulkSize = 1000; // todo: make it configurable

class ExtractionStreamSender {
    constructor(queueSender, integrationId, sourceFormat, getDeepDepthPath = null) {
        this.queueSender = queueSender
        this.bulkExtract = [];
        // this.counter = 0 // it + context should for the eventual consistancy paradigm 
        // this.context = // generate some random hash 
        this.sourceFormat = sourceFormat;
        this.getDeepDepthPath = getDeepDepthPath;
        this.integrationId = integrationId;
    }

    async _invoke(data) {
        if (data && data.constructor === Array) {
            this.bulkExtract.concat(data);
        }
        else {
            this.bulkExtract.push(data);
        }

        while (this.bulkExtract.length >= maxBulkSize) {
            let sendExtractionData = this.bulkExtract.slice(0, maxBulkSize);
            this.bulkExtract = this.bulkExtract.splice(maxBulkSize);

            // todo: add conversion format from source format to json in every new format here
            // ++ get subdirectory on source path in case of deep json, maybe from http requests...
            // for (sendExtractionData){
            // dataResult = this.getSubPath(dataResult)
            // consider to add the number of chunks and other metadata to use as event driven design consistancy
            await this.queueSender.sendMessage({ integrationId: this.integrationId, data: sendExtractionData });

            if (this.bulkExtract.length < maxBulkSize) 
                return true
        }

        return false
    }

    async upstream(data) {
        let hasSent = await this._invoke(data);
        return hasSent
    }

    async upstreamFinish(data) {
        /** Send it to invoke function to make sure that in case of a 
        *   massive load of data the maximum amount of data to send is fixed
        */
        let hasSent = await this._invoke(data);

        // todo: consider to add the number of chunks and other metadata to use for event driven design consistancy
        await this.queueSender.sendMessage({ integrationId: this.integrationId, data: this.bulkExtract });
    }
}


module.exports = { ExtractionStreamSender };
