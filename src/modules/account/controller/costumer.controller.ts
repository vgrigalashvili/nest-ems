import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../role/decorator';
import { RoleGuard } from '../../role/guard';
import { RoleEnum } from '../../role/enum';

import { Costumer } from '../entity';

import { CostumerService } from '../service';
import { CreateCostumerDTO } from '../dto';

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
	create(@Body() costumerArgs: CreateCostumerDTO): Promise<Costumer> {
		return this.costumerService.create(costumerArgs);
	}
}
