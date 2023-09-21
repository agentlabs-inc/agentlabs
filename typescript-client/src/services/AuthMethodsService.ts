/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAuthMethodDto } from '../models/CreateAuthMethodDto';
import type { CreatedAuthMethodDto } from '../models/CreatedAuthMethodDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthMethodsService {

    /**
     * @returns CreatedAuthMethodDto
     * @throws ApiError
     */
    public static createAuthMethod({
        requestBody,
    }: {
        requestBody: CreateAuthMethodDto,
    }): CancelablePromise<CreatedAuthMethodDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth-methods/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
