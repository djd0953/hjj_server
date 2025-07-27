import { Controller, Get, Post, Body } from "@nestjs/common";
import { LoginHistoryService } from "./login_history.service";
import { LoginHistory } from "./model/login_history.entity";

@Controller("login_history")
export class LoginHistoryController {
    constructor(private readonly loginHistoryService: LoginHistoryService) {}

    @Get()
    getAll(): Promise<LoginHistory[]> {
        return this.loginHistoryService.findAll();
    }

    @Post()
    create(@Body() login: Partial<LoginHistory>): Promise<LoginHistory> {
        return this.loginHistoryService.create(login);
    }
}