import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { LoggerService } from '../../logger/logger.service';
import { ConfigService } from '@nestjs/config';
import { response } from 'express';
import { writeFileSync } from 'fs';
import * as path from 'path';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly loggerService: LoggerService,
    private readonly configService: ConfigService,
  ) {
    const logLevels = this.configService.get('LOG_LEVELS').split(',');
    this.loggerService.setContext('LoggingInterceptor');
    this.loggerService.setLogLevels(logLevels);
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const result = {
      message: `${request.method} ${request.url} request received`,
      query: request.query,
      body: request.body,
    };
    const relativePath = path.resolve('logs', 'logs.log');
    writeFileSync(relativePath, JSON.stringify(result) + '\n', { flag: 'a+' });
    this.loggerService.log(result);
    return next.handle().pipe(
      tap((body) => {
        const response = context.switchToHttp().getResponse();
        const result = {
          statusCode: response.statusCode,
          message: `${response.req.method} ${response.req.url} response sent`,
          body: body,
        };
        const relativePath = path.resolve('logs', 'logs.log');
        writeFileSync(relativePath, JSON.stringify(result) + '\n', {
          flag: 'a+',
        });
        this.loggerService.log(result);
      }),
      catchError((err) => {
        const result = {
          statusCode: response.statusCode,
          errorMessage: err.message,
        };
        const relativePath = path.resolve('logs', 'errors.log');
        writeFileSync(relativePath, JSON.stringify(result) + '\n', {
          flag: 'a+',
        });
        this.loggerService.error(result);
        return throwError(err);
      }),
    );
  }
}
