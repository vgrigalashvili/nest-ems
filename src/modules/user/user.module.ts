import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity';

import { IsExist, IsNotExist } from '../common/utils/validator';

import { UserController } from './controller';
import { UserService } from './service';

import { UserRoleModule } from './user-role/user-role.module';

@Module({
	imports: [TypeOrmModule.forFeature([User]), UserRoleModule],
	providers: [IsExist, IsNotExist, UserService],
	controllers: [UserController],
	exports: [UserService],
})
export class UserModule {}
