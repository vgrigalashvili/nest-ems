import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from './entity';
import { RoleController } from './controller';
import { RoleService } from './service';
import { IsExist, IsNotExist } from '../common/utils/validator';
import { UserRole } from '../user/entity';
import { UserRoleService } from '../user/service';

@Module({
	imports: [TypeOrmModule.forFeature([Role, UserRole])],
	providers: [IsExist, IsNotExist, RoleService, UserRoleService],
	controllers: [RoleController],
	exports: [RoleService],
})
export class RoleModule {}
