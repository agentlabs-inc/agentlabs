/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreatedProjectDto } from '../models/CreatedProjectDto';
import type { CreateProjectDto } from '../models/CreateProjectDto';
import type { ListProjectsResultDto } from '../models/ListProjectsResultDto';
import type { ProjectExistsResponseDto } from '../models/ProjectExistsResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ProjectsService {

    /**
     * @returns CreatedProjectDto
     * @throws ApiError
     */
    public static createProject({
        requestBody,
    }: {
        requestBody: CreateProjectDto,
    }): CancelablePromise<CreatedProjectDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/projects/create',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @returns ListProjectsResultDto
     * @throws ApiError
     */
    public static listOrganizationProjects({
        organizationId,
    }: {
        organizationId: string,
    }): CancelablePromise<ListProjectsResultDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/list_for_organization/{organizationId}',
            path: {
                'organizationId': organizationId,
            },
        });
    }

    /**
     * @returns ProjectExistsResponseDto
     * @throws ApiError
     */
    public static projectExists({
        slug,
    }: {
        slug: string,
    }): CancelablePromise<ProjectExistsResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/projects/exists/{slug}',
            path: {
                'slug': slug,
            },
        });
    }

}
