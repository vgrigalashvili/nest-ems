import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../../../../role/entity';

import { RoleSeedService } from './service';

@Module({
	imports: [TypeOrmModule.forFeature([Role])],
	providers: [RoleSeedService],
	exports: [RoleSeedService],
})
export class RoleSeedModule {}
