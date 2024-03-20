import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GlobalResponse } from '../model/global.model';
import { LoginUserRequest, RegisterUserRequest, UserResponse } from '../model/user.model';

@Controller('api/users')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    @HttpCode(201)
    async register(@Body() request: RegisterUserRequest): Promise<GlobalResponse<UserResponse>>{
        const result = await this.userService.register(request);
        return {
            data: result
        }
    }

    @Post('/login')
    @HttpCode(201)
    async login(@Body() request: LoginUserRequest): Promise<GlobalResponse<UserResponse>>{
        const result = await this.userService.login(request);
        return {
            data: result
        }
    }
}
