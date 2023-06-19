import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../../../user/entity';

import { UserRoleSeedService } from './service';
import { UserRole } from '../../../../user/user-role/entity';

@Module({
	imports: [TypeOrmModule.forFeature([User, UserRole])],
	providers: [UserRoleSeedService],
	exports: [UserRoleSeedService],
})
export class UserRoleSeedModule {}
