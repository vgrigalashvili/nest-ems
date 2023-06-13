import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, UserRole } from './entity';

import { IsExist, IsNotExist } from '../common/utils/validator';

import { UserController } from './controller';
import { UserService, UserRoleService } from './service';

@Module({
	imports: [TypeOrmModule.forFeature([User, UserRole])],
	providers: [IsExist, IsNotExist, UserService, UserRoleService],
	controllers: [UserController],
	exports: [UserService, UserRoleService],
})
export class UserModule {}
