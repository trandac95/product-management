import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    data: T;
    metadata: {
        timestamp: number;
        path: string;
        statusCode: number;
    };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();

        try {
            const handler = next.handle();
            if (!handler) {
                console.error('Handler is undefined');
                return of({
                    data: null,
                    metadata: {
                        timestamp: Date.now(),
                        path: request.url,
                        statusCode: 500,
                        error: 'Internal Server Error'
                    }
                });
            }

            return handler.pipe(
                map(data => ({
                    data,
                    metadata: {
                        timestamp: Date.now(),
                        path: request.url,
                        statusCode: response.statusCode
                    }
                }))
            );
        } catch (error) {
            console.error('Error in interceptor:', error);
            return of({
                data: null,
                metadata: {
                    timestamp: Date.now(),
                    path: request.url,
                    statusCode: 500,
                    error: 'Internal Server Error'
                }
            });
        }
    }
} 