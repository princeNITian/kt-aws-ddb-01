import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../db.js";
import { response } from "../response.js";
import { USER_TABLE } from "../tables.js";

export async function createUser(event) {
    const body = JSON.parse(event.body);

    const item = {
        userId: body.userId,
        name: body.name,
        email: body.email
    }

    await docClient.send(new PutCommand({
        TableName: USER_TABLE,
        Item: item,
        ConditionExpression: "attribute_not_exists(userId)"
    }));

    return response(201,{
        success: true,
        message: "User created successfully",
        data: item
    });
}

export async function getUser(event) {
    const {userId} = event.pathParameters;

    const result = await docClient.send(new GetCommand({
        TableName: USER_TABLE,
        Key: { userId }
    }));

    if (!result.Item) {
        return response(404, {
            success: false,
            message: "User not found"
        })
    }
    return response(200, {
        success: true,
        data: result.Item
    });
}

export async function updateUser(event) {
    const {userId} = event.pathParameters;
    const body = JSON.parse(event.body);

    const result = await docClient.send(new UpdateCommand({
        TableName: USER_TABLE,
        Key: { userId },
        UpdateExpression: "set #name = :name, email = :email",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": body.name,
            ":email": body.email
        },
        ReturnValues: "ALL_NEW" 
    }))

    return response(200, {
        success: true,
        message: "User updated successfully",
        data: result.Attributes
    });
}

export async function deleteUser(event) {
    const {userId} = event.pathParameters;

    await docClient.send(new DeleteCommand({
        TableName: USER_TABLE,
        Key: { userId }
    }));

    return response(200, {
        success: true,
        message: "User deleted successfully"
    });
}

// export { createUser, getUser, updateUser, deleteUser };