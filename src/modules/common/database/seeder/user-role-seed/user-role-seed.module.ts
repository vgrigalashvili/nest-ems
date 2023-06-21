import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../../../user/entity';
import { UserRole } from '../../../../user-role/entity';

import { UserRoleSeedService } from './service';

@Module({
	imports: [TypeOrmModule.forFeature([User, UserRole])],
	providers: [UserRoleSeedService],
	exports: [UserRoleSeedService],
})
export class UserRoleSeedModule {}
