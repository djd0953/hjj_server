import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginHistoryModule } from "@modules/login_history/login_history.module";

@Module(
{
    imports: [UserModule, LoginHistoryModule],
    providers: [AuthService],
    exports: [AuthService]
})

export class UserModule {}