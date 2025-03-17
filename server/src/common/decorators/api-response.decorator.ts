import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, ApiCreatedResponse, getSchemaPath } from '@nestjs/swagger';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
    model: TModel,
) => {
    return applyDecorators(
        ApiOkResponse({
            schema: {
                properties: {
                    message: {
                        type: 'string',
                        example: 'Products retrieved successfully',
                    },
                    data: {
                        type: 'array',
                        items: { $ref: getSchemaPath(model) },
                    },
                    pagination: {
                        type: 'object',
                        properties: {
                            page: { type: 'number', example: 1 },
                            limit: { type: 'number', example: 10 },
                            totalItems: { type: 'number', example: 100 },
                            totalPages: { type: 'number', example: 10 },
                            hasNext: { type: 'boolean', example: true },
                            hasPrevious: { type: 'boolean', example: false },
                        },
                    },
                },
            },
        }),
    );
};

export const ApiDataResponse = <TModel extends Type<any>>(
    model: TModel,
    status = 200,
) => {
    const decorator = status === 201 ? ApiCreatedResponse : ApiOkResponse;

    return applyDecorators(
        decorator({
            schema: {
                allOf: [
                    { $ref: getSchemaPath(ApiSuccessResponse) },
                    {
                        properties: {
                            data: { $ref: getSchemaPath(model) },
                        },
                    },
                ],
            },
        }),
    );
}; 