import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LoginHistory } from './model/login_history.entity';

@Injectable()
export class LoginHistoryService
{
    constructor(
        @InjectRepository(LoginHistory)
        private readonly userRepo: Repository<LoginHistory>,
        private readonly dataSource: DataSource, // 트렌잭션
    ) {}

    findAll(): Promise<LoginHistory[]> {
        return this.userRepo.find();
    }

    async create(loginData: Partial<LoginHistory>): Promise<LoginHistory> {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const login = queryRunner.manager.create(LoginHistory, loginData);
            const savedHistory = await queryRunner.manager.save(login);

            await queryRunner.commitTransaction();
            return savedHistory;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }

    async delete(id: number): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.delete(LoginHistory, id);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
