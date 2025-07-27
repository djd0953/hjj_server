import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('item')
export class Item
{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'varchar', length: 64 })
    name!: string;
}