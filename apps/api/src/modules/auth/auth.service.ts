import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '@modules/user/model/user.entity';
import { LoginHistory } from '@modules/login_history/model/login_history.entity';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LoginHistory) private readonly historyRepo: Repository<LoginHistory>,
    private readonly dataSource: DataSource,
  ) {}

  async validateAndLogUser(email: string, password: string, req: Request) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.userRepo.findOne({ where: { email } });

      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      const history = this.historyRepo.create({
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
