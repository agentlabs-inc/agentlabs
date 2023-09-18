/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegisterUserDto } from '../models/RegisterUserDto';
import type { SanitizedUserResponse } from '../models/SanitizedUserResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * @returns SanitizedUserResponse
     * @throws ApiError
     */
    public static register({
        requestBody,
    }: {
        requestBody: RegisterUserDto,
    }): CancelablePromise<SanitizedUserResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/registerUser',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
