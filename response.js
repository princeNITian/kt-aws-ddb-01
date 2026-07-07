// Create a response object for the API Gateway.
export function response(statusCode, body) {

    return {
        statusCode,

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(body)
    };

}