/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AgentChatConversationsService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static getAllConversations({
        agentId,
        memberId,
    }: {
        agentId: string,
        memberId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/conversations/getAll',
            query: {
                'agentId': agentId,
                'memberId': memberId,
            },
        });
    }

    /**
     * @returns any
     * @throws ApiError
     */
    public static getConversationById({
        conversationId,
    }: {
        conversationId: string,
    }): CancelablePromise<Record<string, any>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/conversations/getById/{conversationId}',
            path: {
                'conversationId': conversationId,
            },
        });
    }

}
