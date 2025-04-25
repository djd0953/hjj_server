import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '@modules/user/model/user.entity';
import { LoginHistory } from '@modules/login_history/model/login_history.entity';
import { Request } from 'express';
import { UserService } from '@modules/user/user.service';
import { LoginHistoryService } from '@modules/login_history/login_history.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(LoginHistoryService) private readonly loginHistory: LoginHistoryService,
    private readonly dataSource: DataSource,

    ) {}

  async validateAndLogUser(email: string, password: string, req: Request) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userService.findOne({ where: { email } }, queryRunner);

      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      const history = this.loginHistory.create({
        user: user,
        userAgent: req.headers['user-agent'] || '',
        browserName: 'Chrome', // 필요 시 파싱
        osName: 'Windows',
        osVersion: '10',
        ipAddress: req.ip || '',
        isLogin: true,
      });

      await queryRunner.manager.save(history);
      await queryRunner.commitTransaction();

      return { success: true, userId: user.id };
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return { success: false}
    //   return { success: false, message: e?.message || '' };
    } finally {
      await queryRunner.release();
    }
  }
}
