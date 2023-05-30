import { registerAs } from '@nestjs/config';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

import { MqttConfig } from './config.type';
import validateConfig from '../utils/validate-config';

class EnvironmentVariablesValidator {
	@ValidateIf((envValues) => envValues.DATABASE_URL)
	@IsString()
	MQTT_URL!: string;

	@ValidateIf((envValues) => !envValues.DATABASE_URL)
	@IsString()
	MQTT_USERNAME!: string;

	@ValidateIf((envValues) => !envValues.DATABASE_URL)
	@IsString()
	@IsOptional()
	MQTT_PASSWORD!: string;
}

export default registerAs<MqttConfig>('mqtt', () => {
	validateConfig(process.env, EnvironmentVariablesValidator);

	return {
		url: process.env['MQTT_URL'],
		username: process.env['MQTT_USERNAME'],
		password: process.env['MQTT_PASSWORD'],
	};
});
