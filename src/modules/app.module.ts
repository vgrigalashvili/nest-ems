import { Module } from '@nestjs/common';

import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ForgotModule } from './forgot/forgot.module';
import { RoleModule } from './role/role.module';
import { UserRoleModule } from './user-role/user-role.module';
import { AccountModule } from './account/account.module';

@Module({
	imports: [CommonModule, AuthModule, UserModule, ForgotModule, RoleModule, UserRoleModule, AccountModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
