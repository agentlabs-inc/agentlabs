/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatedSdkSecretDto } from '../models/CreatedSdkSecretDto';
import type { CreateSdkSecretDto } from '../models/CreateSdkSecretDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SdkSecretsService {

    /**
     * @returns CreatedSdkSecretDto
     * @throws ApiError
     */
    public static create({
        requestBody,
    }: {
        requestBody: CreateSdkSecretDto,
    }): CancelablePromise<CreatedSdkSecretDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/sdk-secrets/create',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `You are not authorized to perform this action`,
            },
        });
    }

}
