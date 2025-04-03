import { Controller, Delete, Get, Req, Param, Post, Put, Body, UsePipes, ValidationPipe, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, SignInPayloadDTO, UpdateUserDTO } from './user.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Auth, CurrentUser } from 'src/decorators/decorators.decorator';

@Controller('/user')
export class UserController {
    constructor(
        private userService: UserService
    ){}

    @Get()
    @Auth()
    getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(":id")
    @Auth()
    getUserById(@Param("id") id: string) {
        return this.userService.getUserById(id);
    }

    @Post("sign-in") 
    @UsePipes(new ValidationPipe())
    signIn(@Body() payload: SignInPayloadDTO) {
        return this.userService.signIn(payload);
    }

    @Post()
    @Auth()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    async createUser(@Body() userData: CreateUserDTO) {
        return await this.userService.createUser(userData);
    }

    @Put(":id")
    @Auth()
    @UsePipes(new ValidationPipe({ whitelist: true }))
    updateUser(@Param("id") id: string, @Body() updateData: UpdateUserDTO, @CurrentUser("id") currentUserId: string) {
        return this.userService.updateUser(id, updateData, currentUserId);
    }

    @Delete(":id")
    @Auth()
    deleteUser(@Param("id") id: string) {
        return this.userService.deleteUser(id);
    }
}
