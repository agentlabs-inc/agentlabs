/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateAgentDto } from '../models/CreateAgentDto';
import type { CreatedAgentDto } from '../models/CreatedAgentDto';
import type { ListAgentsResponseDto } from '../models/ListAgentsResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AgentsService {

    /**
     * @returns CreatedAgentDto
     * @throws ApiError
     */
    public static createAgent({
        requestBody,
    }: {
        requestBody: CreateAgentDto,
    }): CancelablePromise<CreatedAgentDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agents/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ListAgentsResponseDto
     * @throws ApiError
     */
    public static listForProject({
        projectId,
    }: {
        projectId: string,
    }): CancelablePromise<ListAgentsResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agents/list_for_project/{projectId}',
            path: {
                'projectId': projectId,
            },
        });
    }

}
