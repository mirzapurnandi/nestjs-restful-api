import { PrismaService } from '../common/prisma.service';
import { Logger } from 'winston';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { UserValidation } from './user.validation';
import * as bcrypt from "bcrypt";

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async register(registerUserRequest: RegisterUserRequest): Promise<UserResponse> {
    this.logger.info(`Register new user ${JSON.stringify(registerUserRequest)}`);
    const registerRequest: RegisterUserRequest = this.validationService.validate(UserValidation.REGISTER, registerUserRequest);

    const totalUserWithSameUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithSameUsername != 0){
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

    const user = await this.prismaService.user.create({
      data: registerRequest
    });

    return {
      username: user.username,
      name: user.name
    };
  }
}
