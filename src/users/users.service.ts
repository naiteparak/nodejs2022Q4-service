import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as crypto from 'crypto';
import { IdParamDto } from '../common/id-param.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return await this.usersRepository.find();
  }

  async findOne(params: IdParamDto): Promise<UserEntity> {
    const user = await this.usersRepository.findOneBy({ id: params.id });
    if (!user) {
      throw new NotFoundException('No user with this id');
    }
    return user;
  }

  async create(body: CreateUserDto): Promise<UserEntity> {
    const user: UserEntity = await this.usersRepository.create({
      ...body,
      id: crypto.randomUUID(),
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return await this.usersRepository.save(user);
  }

  async update(
    params: IdParamDto,
    body: UpdatePasswordDto,
  ): Promise<UserEntity> {
    const user: UserEntity = await this.findOne(params);
    if (user.password !== body.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    await this.usersRepository.update(
      { id: params.id },
      {
        ...user,
        password: body.newPassword,
        version: ++user.version,
        updatedAt: Date.now(),
      },
    );

    return this.usersRepository.findOneBy({ id: params.id });
  }

  async delete(params: IdParamDto): Promise<void> {
    const user = await this.findOne(params);
    await this.usersRepository.delete(user.id);
  }
}
