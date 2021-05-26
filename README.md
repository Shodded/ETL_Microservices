
## Intro 

    Integration microservices system, the system executes integrations,
    by the schema and makes an ETL process and adding it to the relevant collections.
    There are 3 main services such as: Extract service, Transform service and Load Service.
    Each one of those have it's own queue for processing.

## Available Scripts

    In the project directory, you can run:
    The MongoDB creation of the integration collection (full pipeline of an ETL process), 
    All other collections would be created on run time (code-first approach).

### `npm run dev`

    Runs the app in the development mode with the command "npm run dev".<br />
    Send command to the extraction queue on port 3001 [http://localhost:3001](http://localhost:3001).


        curl --location --request POST 'http://127.0.0.1:3001/' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "integrationId": "60755a0a614de73a9651ee65"
        }'


    * lint errors are shown on the console.

### `npm install`

    Command to Install all relevant packages