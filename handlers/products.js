import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../db.js";
import { response } from "../response.js";
import { PRODUCT_TABLE } from "../tables.js";

async function createProduct(event) {
    const body = JSON.parse(event.body);

    const item = {
        productId: body.productId,
        name: body.name,
        price: body.price,
        category: body.category,
        stock: body.stock
    };

    const result = await docClient.send(new PutCommand({
        TableName: PRODUCT_TABLE,
        Item: item,
        ConditionExpression: "attribute_not_exists(productId)"
    }));

    return response(201, {
        success: true,
        message: "Product created successfully",
        data: item
    });
}
    

async function getProduct(event) {
    const {productId} = event.pathParameters;

    const result = await docClient.send(new GetCommand({
        TableName: PRODUCT_TABLE,
        Key: { productId }
    }));

    if (!result.Item) {
        return response(404, {
            success: false,
            message: "Product not found"
        });
    }
    return response(200, {
        success: true,
        data: result.Item
    });
}

async function updateProduct(event) {
    const {productId} = event.pathParameters;
    const body = JSON.parse(event.body);

    const result = await docClient.send(new UpdateCommand({
        TableName: PRODUCT_TABLE,
        Key: { productId },
        UpdateExpression: "set #name = :name, price = :price, category = :category, stock = :stock",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": body.name,
            ":price": body.price,
            ":category": body.category,
            ":stock": body.stock
        },
        ReturnValues: "ALL_NEW"
    }));

    return response(200, {
        success: true,
        message: "Product updated successfully",
        data: result.Attributes
    });
}

async function deleteProduct(event) {
    const {productId} = event.pathParameters;

    await docClient.send(new DeleteCommand({
        TableName: PRODUCT_TABLE,
        Key: { productId }
    }));

    return response(200, {
        success: true,
        message: "Product deleted successfully"
    });
}

export { createProduct, getProduct, updateProduct, deleteProduct };