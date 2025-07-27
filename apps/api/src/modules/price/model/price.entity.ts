import { City } from '@modules/city/model/city.entity';
import { Item } from '@modules/item/model/item.entity';
import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn} from 'typeorm';

@Entity('price')
export class Price
{
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => City)
    @JoinColumn({ name: 'city_id' })
    city!: City;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'item_id' })
    item!: Item;

    @Column({name: 'price', type:'integer'})
    price!: number;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamp', nullable: true })
    deletedAt!: Date | null;
}