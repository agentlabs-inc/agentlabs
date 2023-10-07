/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreateAuthMethodDto = {
    type: 'OAUTH2' | 'EMAIL' | 'ANONYMOUS';
    provider: 'PASSWORDLESS_EMAIL' | 'EMAIL_AND_PASSWORD' | 'ANONYMOUS' | 'GOOGLE' | 'GITHUB' | 'GITLAB' | 'MICROSOFT' | 'FACEBOOK' | 'TWITTER' | 'APPLE';
    projectId: string;
    isEnabled: boolean;
    clientId: string;
    clientSecret: string;
    scopes: Array<string>;
};

