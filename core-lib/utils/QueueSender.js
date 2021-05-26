const request = require('./request')

// After choosing a real queue it can be change here  
module.exports = class QueueSender{
    constructor(conn){
        this.conn = conn
    }

    async sendMessage(data){
        // in original process it would check that the response 
        // status is OK and retry on other status
        await request.post(this.conn, null, data)
    }
}