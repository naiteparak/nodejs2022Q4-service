import { Entity, Column, PrimaryGeneratedColumn, AfterLoad } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  login: string;

  @Exclude()
  @Column('varchar')
  password: string;

  @Column('int')
  version: number;

  @Column('int8')
  createdAt: number;

  @Column('int8')
  updatedAt: number;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string | null;

  @AfterLoad()
  _convertNumerics() {
    this.createdAt = +this.createdAt;
    this.updatedAt = +this.updatedAt;
  }
}
