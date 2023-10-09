/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginResponseDto } from '../models/LoginResponseDto';
import type { LoginUserDto } from '../models/LoginUserDto';
import type { oauthUserAuthorizeDto } from '../models/oauthUserAuthorizeDto';
import type { RegisterUserDto } from '../models/RegisterUserDto';
import type { UserCreatedResponseDto } from '../models/UserCreatedResponseDto';
import type { WhoAmIResultDto } from '../models/WhoAmIResultDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UsersService {

    /**
     * @returns UserCreatedResponseDto
     * @throws ApiError
     */
    public static register({
        requestBody,
    }: {
        requestBody: RegisterUserDto,
    }): CancelablePromise<UserCreatedResponseDto> {
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

    /**
     * @returns LoginResponseDto
     * @throws ApiError
     */
    public static login({
        requestBody,
    }: {
        requestBody: LoginUserDto,
    }): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `The provided credentials are invalid or the user does not have a password configured.`,
                500: `Something went wrong.`,
            },
        });
    }

    /**
     * @returns LoginResponseDto
     * @throws ApiError
     */
    public static handleOAuthCallback({
        providerId,
        requestBody,
    }: {
        providerId: string,
        requestBody: oauthUserAuthorizeDto,
    }): CancelablePromise<LoginResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/oauth/handleCallback/{providerId}',
            path: {
                'providerId': providerId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                500: `Something went wrong.`,
            },
        });
    }

    /**
     * @returns WhoAmIResultDto
     * @throws ApiError
     */
    public static whoami(): CancelablePromise<WhoAmIResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/users/whoami',
            errors: {
                404: `User not found`,
                500: `Something went wrong.`,
            },
        });
    }

}
