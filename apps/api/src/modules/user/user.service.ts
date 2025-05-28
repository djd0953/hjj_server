import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { User } from './model/user.entity';

@Injectable()
export class UserService
{
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        @InjectDataSource()
        private readonly dataSource: DataSource, // 트렌잭션
    ) {}

    findAll(queryRunner?: QueryRunner): Promise<User[]> {
        if (queryRunner)
            return queryRunner.manager.find(User);
        else
            return this.userRepo.find();
    }

    findOne(condition: any, queryRunner?: QueryRunner): Promise<User | null> {
        if (queryRunner)
            return queryRunner.manager.findOne(User, condition);
        else
            return this.userRepo.findOne(condition);
    }

    async create(userData: Partial<User>, queryRunner?: QueryRunner): Promise<User> {
        let transaction: QueryRunner | undefined = queryRunner;

        if (!transaction) {
            transaction = this.dataSource.createQueryRunner();
            await transaction.connect();
            await transaction.startTransaction();
        }

        try {
            const user = transaction.manager.create(User, userData);
            const savedUser = await transaction.manager.save(user);

            return savedUser;
        }
        catch (error) {
            if (queryRunner) {
                await transaction.rollbackTransaction();
            }

            throw error;
        }
        finally {
            if (!queryRunner) {
                await transaction.release();
            }
        }
    }

    async delete(id: number, queryRunner?: QueryRunner): Promise<void> {
        let transaction: QueryRunner | undefined = queryRunner; 

        if (!transaction) {
            transaction = this.dataSource.createQueryRunner();
            await transaction.connect();
            await transaction.startTransaction();
        }

        try {
            await transaction.manager.update(User, id, { deletedAt: new Date() });
            await transaction.commitTransaction();
        } catch (error) {
            if (queryRunner)
                await transaction.rollbackTransaction();

            throw error;
        } finally {
            if (queryRunner)
                await queryRunner.release();
        }
    }
}
