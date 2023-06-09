import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../../../../user/entity';

import { UserSeedService } from './service';

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UserSeedService],
	exports: [UserSeedService],
})
export class UserSeedModule {}
