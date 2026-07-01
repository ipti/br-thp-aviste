import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? (exception.getResponse() as Record<string, unknown>)
        : {};

    const message =
      exception instanceof HttpException
        ? (exceptionResponse.message ?? exception.message)
        : 'Erro interno do servidor';

    const { message: _, statusCode: __, error: ___, ...extras } =
      exceptionResponse as Record<string, unknown>;

    res.status(status).json({
      statusCode: status,
      message,
      error: HttpStatus[status],
      path: req.url,
      timestamp: new Date().toISOString(),
      ...extras,
    });
  }
}
