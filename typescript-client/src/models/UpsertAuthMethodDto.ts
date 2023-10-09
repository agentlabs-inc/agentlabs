/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpsertAuthMethodDto = {
    provider: 'PASSWORDLESS_EMAIL' | 'EMAIL_AND_PASSWORD' | 'SMS' | 'ANONYMOUS' | 'GOOGLE' | 'GITHUB' | 'GITLAB' | 'MICROSOFT';
    projectId: string;
    isEnabled: boolean;
    clientId: string;
    clientSecret: string;
    scopes: Array<string>;
};

