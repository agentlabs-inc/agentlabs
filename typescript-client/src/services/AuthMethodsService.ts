/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatedDemoAuthMethodsDto } from '../models/CreatedDemoAuthMethodsDto';
import type { CreateDemoAuthMethodsDto } from '../models/CreateDemoAuthMethodsDto';
import type { ListAuthMethodResponseDto } from '../models/ListAuthMethodResponseDto';
import type { UpsertAuthMethodDto } from '../models/UpsertAuthMethodDto';
import type { UpsertedAuthMethodDto } from '../models/UpsertedAuthMethodDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AuthMethodsService {

    /**
     * @returns UpsertedAuthMethodDto
     * @throws ApiError
     */
    public static upsert({
        requestBody,
    }: {
        requestBody: UpsertAuthMethodDto,
    }): CancelablePromise<UpsertedAuthMethodDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authMethods/upsert',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns CreatedDemoAuthMethodsDto
     * @throws ApiError
     */
    public static createDemoAuthMethod({
        requestBody,
    }: {
        requestBody: CreateDemoAuthMethodsDto,
    }): CancelablePromise<CreatedDemoAuthMethodsDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/authMethods/createDemoAuthMethods',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ListAuthMethodResponseDto
     * @throws ApiError
     */
    public static listAuthMethods({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<ListAuthMethodResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/authMethods/listForProject/{projectId}',
            path: {
                'projectId': projectId,
            },
        });
    }

}
