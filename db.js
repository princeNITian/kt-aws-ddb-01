import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Create an Amazon DynamoDB service client object.
const client = new DynamoDBClient({
    region: "us-east-1"
});

const docClient =
    DynamoDBDocumentClient.from(client);


export { docClient };