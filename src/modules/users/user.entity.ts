import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from '../reports/reports.entity';

export enum ROLES {
  SUPER_ADMIN = 's-admin',
  ADMIN = 'admin',
  USER = 'user',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
