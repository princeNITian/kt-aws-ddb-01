import { createUser, getUser, updateUser, deleteUser } from "./handlers/users.js";
import { createProduct, getProduct, updateProduct, deleteProduct } from "./handlers/products.js";
import { response } from "./response.js";
import { getProductsByCategory } from "./handlers/gsi-example.js";

export const handler = async (event) => {
    console.log("Received event:", JSON.stringify(event));
    try {
        switch (event.routeKey) {
            case "POST /users":
                return await createUser(event);
            case "GET /users/{userId}":
                return await getUser(event);
            case "PUT /users/{userId}":
                return await updateUser(event);
            case "DELETE /users/{userId}":
                return await deleteUser(event);
            case "POST /products":
                return await createProduct(event);
            case "GET /products":
                return await getProductsByCategory(event);
            case "GET /products/{productId}":
                return await getProduct(event);
            case "PUT /products/{productId}":
                return await updateProduct(event);
            case "DELETE /products/{productId}":
                return await deleteProduct(event);
            default:
                return response(404, { success: false, message: "Route not found" });
        }
    } catch (err) {
        console.error("Error", err);
        return response(500, { success: false, message: err.message });
    }
}
