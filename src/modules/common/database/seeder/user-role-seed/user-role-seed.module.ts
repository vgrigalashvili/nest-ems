import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User, UserRole } from '../../../../user/entity';

import { UserRoleSeedService } from './service';

@Module({
	imports: [TypeOrmModule.forFeature([UserRole, User])],
	providers: [UserRoleSeedService],
	exports: [UserRoleSeedService],
})
export class UserRoleSeedModule {}
