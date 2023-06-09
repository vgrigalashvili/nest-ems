import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';

import appConfig from '../../config/app.config';
import databaseConfig from '../../config/database.config';

import { TypeOrmConfigService } from '../typeorm-config.service';

import { UserSeedModule } from './user-seed/user-seed.module';
import { RoleSeedModule } from './role-seed/role-seed.module';
import { UserRoleSeedModule } from './user-role-seed/user-role-seed.module';

@Module({
	imports: [
		UserSeedModule,
		ConfigModule.forRoot({
			envFilePath: ['.env.development'],
			ignoreEnvFile: false,
			isGlobal: true,
			load: [databaseConfig, appConfig],
		}),
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
			dataSourceFactory: async (options: DataSourceOptions) => {
				return new DataSource(options).initialize();
			},
		}),
		RoleSeedModule,
		UserRoleSeedModule,
	],
})
export class SeederModule {}
