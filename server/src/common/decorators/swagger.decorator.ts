import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
    ApiTags,
} from '@nestjs/swagger';

export function ApiAuth(summary: string) {
    return applyDecorators(
        ApiOperation({ summary }),
        ApiBearerAuth('JWT-auth'),
        ApiResponse({ status: 200, description: 'Successful operation' }),
        ApiResponse({ status: 401, description: 'Unauthorized' }),
    );
}

export function ApiCreate(entityName: string) {
    return applyDecorators(
        ApiOperation({ summary: `Create a new ${entityName}` }),
        ApiBearerAuth('JWT-auth'),
        ApiResponse({
            status: 201,
            description: `The ${entityName} has been successfully created.`,
        }),
        ApiResponse({ status: 400, description: 'Bad Request.' }),
        ApiResponse({ status: 401, description: 'Unauthorized.' }),
    );
}

export function ApiPaginated(entityName: string) {
    return applyDecorators(
        ApiOperation({ summary: `Get all ${entityName}s` }),
        ApiQuery({
            name: 'page',
            required: false,
            type: Number,
            description: 'Page number',
        }),
        ApiQuery({
            name: 'limit',
            required: false,
            type: Number,
            description: 'Number of items per page',
        }),
        ApiResponse({
            status: 200,
            description: `Return all ${entityName}s.`,
        }),
    );
}

export function ApiGetById(entityName: string) {
    return applyDecorators(
        ApiOperation({ summary: `Get a ${entityName} by id` }),
        ApiParam({
            name: 'id',
            required: true,
            description: `${entityName} ID`,
        }),
        ApiResponse({
            status: 200,
            description: `Return the ${entityName}.`,
        }),
        ApiResponse({ status: 404, description: `${entityName} not found.` }),
    );
}

export function ApiUpdate(entityName: string) {
    return applyDecorators(
        ApiOperation({ summary: `Update a ${entityName}` }),
        ApiBearerAuth('JWT-auth'),
        ApiParam({
            name: 'id',
            required: true,
            description: `${entityName} ID`,
        }),
        ApiResponse({
            status: 200,
            description: `The ${entityName} has been successfully updated.`,
        }),
        ApiResponse({ status: 404, description: `${entityName} not found.` }),
        ApiResponse({ status: 401, description: 'Unauthorized.' }),
    );
}

export function ApiDelete(entityName: string) {
    return applyDecorators(
        ApiOperation({ summary: `Delete a ${entityName}` }),
        ApiBearerAuth('JWT-auth'),
        ApiParam({
            name: 'id',
            required: true,
            description: `${entityName} ID`,
        }),
        ApiResponse({
            status: 200,
            description: `The ${entityName} has been successfully deleted.`,
        }),
        ApiResponse({ status: 404, description: `${entityName} not found.` }),
        ApiResponse({ status: 401, description: 'Unauthorized.' }),
    );
} 