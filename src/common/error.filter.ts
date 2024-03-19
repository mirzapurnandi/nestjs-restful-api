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
    
    if(exception instanceof HttpException){
      response.status(exception.getStatus()).json({
        errors: exception.getResponse(),
      })
    } else if(exception instanceof ZodError) {
      let errorMessage = [];
      for (const key in exception.errors) {
        let keys = exception.errors[key].path[0];
          errorMessage[keys] = exception.errors[key].message;
      };
      
      response.status(400).json({
        errors: "Validation Error"
        // errors: errorMessage
      })
    } else {
      response.status(500).json({
        errors: exception.message,
      })
    }
  }
}
