import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  make: string;
  @Column() model: string;
  @Column() year: number;
  @Column() lat: number;
  @Column() lng: number;
  @Column() milleage: number;

  @Column()
  price: number;
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
 
}
