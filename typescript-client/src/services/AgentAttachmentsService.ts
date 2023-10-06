/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AgentAttachmentsService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static listByMessageId({
        messageId,
    }: {
        messageId: string,
    }): CancelablePromise<Array<Record<string, any>>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agent-attachments/listByMessageId/{messageId}',
            path: {
                'messageId': messageId,
            },
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static createSync({
        projectId,
        agentId,
        messageId,
    }: {
        projectId: string,
        agentId: string,
        messageId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agent-attachments/createMessageAttachmentSync',
            query: {
                'projectId': projectId,
                'agentId': agentId,
                'messageId': messageId,
            },
        });
    }

}
