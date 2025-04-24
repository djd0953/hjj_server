import { User } from '@modules/user/model/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne, Index } from 'typeorm';

@Entity('login_history')
@Index(['user_id', 'createdAt'])
export class LoginHistory
{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'user_agent', type: 'varchar', length: 255 })
    userAgent!: string;

    @Column({ name: 'browser_name', type: 'varchar', length: 255 })
    browserName!: string;

    @Column({ name: 'os_name', type: 'varchar', length: 255 })
    osName!: string;

    @Column({ name: 'os_version', type: 'varchar', length: 255 })
    osVersion!: string;

    @Column({ name: 'ip_address', type: 'varchar', length: 255 })
    ipAddress!: string;

    @Column({ name: 'is_login', default: false})
    isLogin!: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ nullable: true })
    deletedAt!: Date | null;

    @ManyToOne(() => User, (user) => user.loginHistories)
    @JoinColumn({ name: 'user_id' })
    user!: User;
}