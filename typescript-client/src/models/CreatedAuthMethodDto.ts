/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CreatedAuthMethodDto = {
    type: 'OAUTH2' | 'EMAIL' | 'ANONYMOUS';
    provider: 'PASSWORDLESS_EMAIL' | 'EMAIL_AND_PASSWORD' | 'ANONYMOUS' | 'GOOGLE' | 'GITHUB' | 'GITLAB' | 'MICROSOFT' | 'FACEBOOK' | 'TWITTER' | 'APPLE';
    projectId: string;
    isEnabled: boolean;
    clientId: string | null;
    clientSecret: string | null;
    scopes: Array<string>;
    createdAt: string;
    updatedAt: string;
};

