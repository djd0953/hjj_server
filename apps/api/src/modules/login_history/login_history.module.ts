import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoginHistory } from "./model/login_history.entity";
import { LoginHistoryService } from "./login_history.service";
import { LoginHistoryController } from "./login_history.controller";

@Module(
{
    imports: [TypeOrmModule.forFeature([LoginHistory])],
    providers: [LoginHistoryService],
    controllers: [LoginHistoryController],
})

export class LoginHistoryModule {}