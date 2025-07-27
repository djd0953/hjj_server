import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./model/user.entity";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Post()
    create(@Body() user: Partial<User>): Promise<User> {
        return this.userService.create(user);
    }
}