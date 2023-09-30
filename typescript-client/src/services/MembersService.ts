/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginMemberResponseDto } from '../models/LoginMemberResponseDto';
import type { RegisterResponseDto } from '../models/RegisterResponseDto';
import type { RequestPasswordlessEmailDto } from '../models/RequestPasswordlessEmailDto';
import type { VerifyPasswordlessEmailDto } from '../models/VerifyPasswordlessEmailDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class MembersService {

    /**
     * @returns RegisterResponseDto
     * @throws ApiError
     */
    public static requestPasswordlessEmail({
        projectId,
        requestBody,
    }: {
        projectId: string,
        requestBody: RequestPasswordlessEmailDto,
    }): CancelablePromise<RegisterResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/members/p/{projectId}/requestPasswordlessEmail',
            path: {
                'projectId': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns LoginMemberResponseDto
     * @throws ApiError
     */
    public static verifyPasswordlessEmail({
        projectId,
        requestBody,
    }: {
        projectId: string,
        requestBody: VerifyPasswordlessEmailDto,
    }): CancelablePromise<LoginMemberResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/members/p/{projectId}/verifyPasswordlessEmail',
            path: {
                'projectId': projectId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
