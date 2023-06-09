import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ForgotModule } from './forgot/forgot.module';

@Module({
	imports: [CommonModule, UserModule, AuthModule, ForgotModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
