import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';

import mqttConfig from './config/mqtt.config';

import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({
	imports: [
		/* Config Module */
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env['NODE_ENV']}`,
			ignoreEnvFile: process.env['NODE_ENV'] === 'development' || process.env['NODE_ENV'] === 'test' ? false : true,
			isGlobal: true,
			load: [appConfig, authConfig, databaseConfig, mqttConfig],
		}),

		/* TypeORM Module */
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
			dataSourceFactory: async (options: DataSourceOptions) => {
				return new DataSource(options).initialize();
			},
		}),
	],

	providers: [],
})
export class CommonModule {}
