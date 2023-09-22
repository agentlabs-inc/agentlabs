import { OpenAPI } from "./index";
import { getAccessTokenPromise } from "$lib/stores/auth";

/* We can overwrite the default configuration by exporting a getToken function.
 * This function will be called before each request to get a token.
 * See: https://github.com/ferdikoomen/openapi-typescript-codegen/blob/master/docs/authorization.md
 */
export const getToken = async () => {
    return await getAccessTokenPromise();
};

OpenAPI.TOKEN = getToken;

// TODO: change this to the backend url
OpenAPI.BASE = "http://localhost:3001";