import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ForgotModule } from './forgot/forgot.module';

@Module({
	imports: [CommonModule, AuthModule, UserModule, ForgotModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
