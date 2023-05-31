import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity';
import { IsExist, IsNotExist } from '../common/utils/validator';

import { UserService } from './service';

import { UserController } from './controller';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [IsExist, IsNotExist, UserService],
	controllers: [UserController],
})
export class UserModule {}
