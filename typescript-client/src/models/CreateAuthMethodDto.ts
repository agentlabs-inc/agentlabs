/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateAuthMethodDto = {
    type: 'OAUTH2' | 'API_KEY' | 'PASSWORDLESS_EMAIL' | 'PASSWORDLESS_SMS';
    provider: 'EMAIL' | 'GOOGLE' | 'GITHUB' | 'GITLAB' | 'MICROSOFT' | 'FACEBOOK' | 'TWITTER' | 'APPLE';
    projectId: string;
    isEnabled: boolean;
    clientId: string;
    clientSecret: string;
    scopes: Array<string>;
};

