import { Controller, HttpCode, HttpStatus, Post, Request, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../role/decorator';
import { RoleGuard } from '../../role/guard';
import { RoleEnum } from '../../role/enum';

import { User } from '../../user/entity';
import { Costumer } from '../entity';

import { CostumerService } from '../service';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('costumer')
@Controller({ path: 'costumer', version: '1' })
export class CostumerController {
	constructor(private readonly costumerService: CostumerService) {}

	/* create costumer account */
	@SerializeOptions({
		groups: ['user'],
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Request() request: Request & { user: User }): Promise<Costumer> {
		console.log(request.user.id);
		return this.costumerService.create({ owner_id: request.user.id });
	}
}
