import { OpenAPI } from './index';

/* We can overwrite the default configuration by exporting a getToken function.
 * This function will be called before each request to get a token.
 * See: https://github.com/ferdikoomen/openapi-typescript-codegen/blob/master/docs/authorization.md
 */
export const getToken = () => {
    // Some code that requests a token...
    console.log('Getting token overwrite executed.');
    return Promise.resolve('my-token');
};

OpenAPI.TOKEN = getToken;

OpenAPI.BASE = process.env.BACKEND_URL ?? "http://localhost:3001";