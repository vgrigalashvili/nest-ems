import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRole } from '../user-role/entity';
import { Company, Costumer } from './entity';
import { CompanyService, CostumerService } from './service';

import { CompanyController, CostumerController } from '../account/controller';
import { UserRoleModule } from '../user-role/user-role.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule, UserRoleModule, TypeOrmModule.forFeature([Costumer, Company, UserRole])],
	controllers: [CostumerController, CompanyController],
	providers: [CostumerService, CompanyService],
	exports: [CostumerService, CompanyService],
})
export class AccountModule {}
