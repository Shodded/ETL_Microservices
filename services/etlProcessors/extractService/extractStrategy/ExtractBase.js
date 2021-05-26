class ExtractBase {
    constructor(streamSender) {
        this.hasMore = true;
        this.streamSender = streamSender;
    }

    setInitArgs = (args) =>{
        this.args = args;
    }

    process = async () => {
        let dataResult = [];
        await this.setupProcess();

        await this.beforeProcess();

        // Main process
        while (this.hasMore) {
            dataResult = [];
            dataResult = await this.invokeAction();

            await this.afterAction(dataResult);

            if (this.hasMore) {
                await this.streamSender.upstream(dataResult);
            }
            else
                await this.streamSender.upstreamFinish(dataResult);
        }

        await this.afterProcess();
    };

    setupProcess = async () => {
        // implement it on derived class
    };

    beforeProcess = async () => {
        // implement it when needed
    };

    invokeAction = async () => {
        // implement it on derived class
    };

    afterAction = async (dataResult = null) => {
        // implement it on derived class when needed
    };

    afterProcess = async () => {
        // implement it on derived class when needed
    };
}


exports.ExtractBase = ExtractBase;
