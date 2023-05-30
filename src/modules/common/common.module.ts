import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import mqttConfig from './config/mqtt.config';

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env['NODE_ENV']}`,
			ignoreEnvFile: process.env['NODE_ENV'] === 'development' || process.env['NODE_ENV'] === 'test' ? false : true,
			isGlobal: true,
			load: [appConfig, authConfig, databaseConfig, mqttConfig],
		}),
	],
	providers: [],
})
export class CommonModule {}
