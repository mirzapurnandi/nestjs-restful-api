import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { GlobalResponse } from '../model/global.model';
import { RegisterUserRequest, UserResponse } from '../model/user.model';

@Controller('api/users')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    async register(@Body() request: RegisterUserRequest): Promise<GlobalResponse<UserResponse>>{
        const result = await this.userService.register(request);
        return {
            data: result
        }
    }
}
