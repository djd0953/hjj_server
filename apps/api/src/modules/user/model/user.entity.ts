import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany, DeleteDateColumn } from 'typeorm';
import { LoginHistory } from '@modules/login_history/model/login_history.entity';

@Entity('user')
// @Index(['email'], { unique: true })
export class User 
{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'varchar', length: 255 })
    name!: string;

    @Index({unique: true})
    @Column({ type: 'varchar', length: 255, unique: true })
    email!: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password!: string;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt!: Date | null;

    @OneToMany(() => LoginHistory, (login) => login.user)
    loginHistories!: LoginHistory[];
}