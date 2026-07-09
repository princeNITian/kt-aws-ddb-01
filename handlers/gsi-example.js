import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../db.js";
import { response } from "../response.js";
import { PRODUCT_TABLE } from "../tables.js";
// Get All Mobile Products

// Index Name: CategoryIndex
// Partition Key: category
// Sort Key: price

export async function getProductsByCategory(event) {
    const categoryName  = event.queryStringParameters.category;

    const result = await docClient.send(new QueryCommand({
        TableName: PRODUCT_TABLE,
        IndexName: "CategoryIndex",
        KeyConditionExpression: "category = :category",
        ExpressionAttributeValues: {
            ":category": categoryName
        }
    }));

    if (!result.Items || result.Items.length === 0) {
        return response(404, {
            success: false,
            message: "No products found for the specified category"
        });
    }

    return response(200, { success: true, data: result.Items });
}