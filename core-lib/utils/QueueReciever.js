const request = require('./request')

// After choosing a real queue it can be change here  
module.exports = class QueueReciever{
    constructor(conn){
        this.conn = conn
    }

    async fetchBulk() {
        let result = await request.get(this.conn)
        if (result && result.status == 200)
            return result.data
        
        return null
    }
}