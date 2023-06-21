import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './service';
import { AuthController } from './controller';

import { UserModule } from '../user/user.module';
import { IsExist, IsNotExist } from '../common/utils/validator';
import { JwtStrategy } from './strategy';
import { ForgotModule } from '../forgot/forgot.module';
import { MailModule } from '../common/mail/mail.module';
import { UserRoleModule } from '../user-role/user-role.module';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('auth.secret'),
				signOptions: {
					expiresIn: configService.get('auth.expires'),
				},
			}),
		}),
		PassportModule,
		UserModule,
		ForgotModule,
		MailModule,
		UserRoleModule,
	],
	controllers: [AuthController],
	providers: [AuthService, IsExist, IsNotExist, JwtStrategy],
	exports: [AuthService],
})
export class AuthModule {}
