import * as path from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { DataSource, DataSourceOptions } from 'typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';

import { TypeOrmConfigService } from './database/typeorm-config.service';
import { MailModule } from './mail/mail.module';
import { MailConfigService } from './mail/mail-config.service';

import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import databaseConfig from './config/database.config';
import mailConfig from './config/mail.config';
import mqttConfig from './config/mqtt.config';

import { AllConfigType } from './config/config.type';

@Module({
	imports: [
		/* Config Module */
		ConfigModule.forRoot({
			envFilePath: `.env.${process.env['NODE_ENV']}`,
			ignoreEnvFile: process.env['NODE_ENV'] === 'development' || process.env['NODE_ENV'] === 'test' ? false : true,
			isGlobal: true,
			load: [appConfig, authConfig, databaseConfig, mqttConfig, mailConfig],
		}),

		/* TypeORM Module */
		TypeOrmModule.forRootAsync({
			useClass: TypeOrmConfigService,
			dataSourceFactory: async (options: DataSourceOptions) => {
				return new DataSource(options).initialize();
			},
		}),

		/* Mailer Module */
		MailerModule.forRootAsync({
			useClass: MailConfigService,
		}),
		I18nModule.forRootAsync({
			useFactory: (configService: ConfigService<AllConfigType>) => ({
				fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
					infer: true,
				}),
				loaderOptions: { path: path.join(__dirname, './i18n/'), watch: true },
			}),
			resolvers: [
				{
					use: HeaderResolver,
					useFactory: (configService: ConfigService) => {
						return [configService.get('app.headerLanguage')];
					},
					inject: [ConfigService],
				},
			],
			imports: [ConfigModule],
			inject: [ConfigService],
		}),
		MailModule,
	],

	providers: [],
})
export class CommonModule {}
