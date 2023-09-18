/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RegisterUserDto } from '../models/RegisterUserDto';
import type { UserCreatedDto } from '../models/UserCreatedDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * @returns UserCreatedDto
     * @throws ApiError
     */
    public static register({
        requestBody,
    }: {
        requestBody: RegisterUserDto,
    }): CancelablePromise<UserCreatedDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `User already exists, please login.`,
                500: `Something went wrong.`,
            },
        });
    }

}
