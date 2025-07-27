import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

enum CityType {
    CITY = 1,
    CASTLE = 2,
    VILLAGE = 3
}

@Entity('city')
export class City
{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'name', type: 'varchar', length: 64 })
    name!: string;

    @Column({name:'type', type:'int', default: CityType.CITY, comment: '1:도시, 2:성, 3:마을'})
    type!: CityType;

    @Column({ name: 'color', nullable: true, type: 'varchar', length: 8 })
    color!: string;
}