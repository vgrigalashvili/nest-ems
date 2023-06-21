import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRole } from './entity';
import { UserRoleService } from './service';
import { UserRoleController } from './controller/user-role.controller';

@Module({
	imports: [TypeOrmModule.forFeature([UserRole])],
	providers: [UserRoleService],
	exports: [UserRoleService],
	controllers: [UserRoleController],
})
export class UserRoleModule {}
