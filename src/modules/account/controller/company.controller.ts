import { Body, Controller, HttpCode, HttpStatus, Post, Request, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../role/decorator';
import { RoleGuard } from '../../role/guard';
import { RoleEnum } from '../../role/enum';
import { CreateCompanyDTO } from '../dto';

import { User } from '../../user/entity';
import { Company } from '../entity';

import { CompanyService } from '../service';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('company')
@Controller({ path: 'company', version: '1' })
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	/* create company account */
	@SerializeOptions({ groups: ['user'] })
	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Request() request: Request & { user: User }, @Body() companyArgs: CreateCompanyDTO): Promise<Company> {
		const { public_id, name } = companyArgs;

		return this.companyService.create(request.user.id, { public_id: public_id, name: name });
	}
}
