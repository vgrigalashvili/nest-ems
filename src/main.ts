import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { Transport } from '@nestjs/microservices';
import { json } from 'express';
import helmet from 'helmet';

import { AppModule } from './modules/app.module';
import { useContainer } from 'class-validator';

import { AllConfigType } from './modules/common/config/config.type';
import validationOptions from './modules/common/utils/validation-options';

/**
 * Build & bootstrap the NestJS API.
 * This method is the starting point of the API; it registers the application
 * module and registers essential components such as the logger and request
 * parsing middleware.
 */
async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule, { cors: true });
	useContainer(app.select(AppModule), { fallbackOnErrors: true });

	const configService = app.get(ConfigService<AllConfigType>);

	app.enableShutdownHooks();
	app.setGlobalPrefix(configService.getOrThrow('app.apiPrefix', { infer: true }), {
		exclude: ['/'],
	});

	app.enableVersioning({
		type: VersioningType.URI,
	});

	app.useGlobalPipes(new ValidationPipe(validationOptions));
	app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

	/**
	 * Swagger API documentation.
	 *
	 * @todo See the `nestjs/swagger` NPM package documentation to customize the
	 *       code below with API keys, security requirements, tags and more.
	 */
	const version = require('../package.json').version || '';

	const options = new DocumentBuilder()
		.setTitle('EMS')
		.setDescription('`Elevator Management System`')
		.setVersion(version)
		.addBearerAuth()
		.build();

	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);

	app.use(json());
	app.use(helmet());

	// Hybrid application # https://docs.nestjs.com/faq/hybrid-application#hybrid-application
	// app.connectMicroservice({
	// 	transport: Transport.MQTT,
	// 	options: {
	// 		url: configService.getOrThrow('mqtt.url', { infer: true }),
	// 		username: configService.getOrThrow('mqtt.username', { infer: true }),
	// 		password: configService.getOrThrow('mqtt.password', { infer: true }),
	// 	},
	// });

	// await app.startAllMicroservices();
	console.log(configService.getOrThrow('app.port', { infer: true }));
	await app.listen(configService.getOrThrow('app.port', { infer: true }));
}
void bootstrap();
