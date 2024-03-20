import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      const errorMessages = exception.errors.map((item) => {
        return {
          message: item.message,
          path: item.path.join('.'),
        };
      });

      response.status(400).json({
        errors: 'Validation Error',
        data: errorMessages,
      });
    } else {
      response.status(500).json({
        errors: exception.message,
      });
    }
  }
}
