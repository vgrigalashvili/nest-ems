import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRole } from '../user-role/entity';
import { Costumer } from './entity/costumer';
import { CostumerService } from './service';

import { CostumerController } from '../account/controller';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule, UserRoleModule, TypeOrmModule.forFeature([Costumer, UserRole])],
	controllers: [CostumerController],
	providers: [CostumerService],
	exports: [CostumerService],
})
export class AccountModule {}
