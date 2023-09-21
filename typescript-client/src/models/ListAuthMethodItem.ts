/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ListAuthMethodItem = {
    type: 'OAUTH2' | 'API_KEY' | 'PASSWORDLESS_EMAIL' | 'PASSWORDLESS_SMS';
    provider: 'EMAIL' | 'GOOGLE' | 'GITHUB' | 'GITLAB' | 'MICROSOFT' | 'FACEBOOK' | 'TWITTER' | 'APPLE';
    projectId: string;
    isEnabled: boolean;
    clientId: string | null;
    clientSecret: string | null;
    scopes: Array<string>;
    createdAt: string;
    updatedAt: string;
};

