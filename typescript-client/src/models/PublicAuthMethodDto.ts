/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PublicAuthMethodDto = {
    type: 'OAUTH2' | 'EMAIL' | 'ANONYMOUS';
    provider: 'PASSWORDLESS_EMAIL' | 'EMAIL_AND_PASSWORD' | 'ANONYMOUS' | 'GOOGLE' | 'GITHUB' | 'GITLAB' | 'MICROSOFT' | 'FACEBOOK' | 'TWITTER' | 'APPLE';
    clientId: string;
    isUsingDemoConfig: boolean;
    scopes: Array<string>;
};

