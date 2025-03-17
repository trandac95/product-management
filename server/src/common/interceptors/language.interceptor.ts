import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
    constructor(private readonly i18n: I18nService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const lang = request.headers['x-custom-lang'] || 'en';
        request.i18nLang = lang;

        return next.handle();
    }
}