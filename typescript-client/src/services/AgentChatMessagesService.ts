/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AgentChatMessagesService {

    /**
     * @returns any
     * @throws ApiError
     */
    public static listByConversationId({
        conversationId,
    }: {
        conversationId: string,
    }): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agent-chat-messages/listByConversationId/{conversationId}',
            path: {
                'conversationId': conversationId,
            },
        });
    }

}
