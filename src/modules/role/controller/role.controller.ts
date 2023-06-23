import {
	Body,
	Controller,
	DefaultValuePipe,
	Get,
	HttpCode,
	HttpStatus,
	ParseIntPipe,
	Post,
	Query,
	SerializeOptions,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { InfinityPaginationResultType } from '../../../modules/common/utils/types';
import { infinityPagination } from '../../../modules/common/utils/infinity-pagination';

import { Roles } from '../decorator';
import { RoleEnum } from '../enum';
import { RoleGuard } from '../guard';
import { Role } from '../entity';
import { CreateRoleDTO } from '../dto';
import { RoleService } from '../service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('role')
@Controller({
	path: 'role',
	version: '1',
})
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	/* create role */
	@SerializeOptions({
		groups: ['admin'],
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createRoleArgs: CreateRoleDTO): Promise<Role> {
		return this.roleService.create(createRoleArgs);
	}

	/* find all roles */
	@SerializeOptions({ groups: ['admin'] })
	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
	): Promise<InfinityPaginationResultType<Role>> {
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.roleService.findManyWithPagination({
				page,
				limit,
			}),
			{ page, limit }
		);
	}
}
