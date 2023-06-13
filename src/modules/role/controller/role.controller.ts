import { Body, Controller, HttpCode, HttpStatus, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../decorator';
import { RoleEnum } from '../enum';
import { RoleGuard } from '../guard';
import { Role } from '../entity';
import { CreateRoleDTO } from '../dto';
import { RoleService } from '../service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Role')
@Controller({
	path: 'role',
	version: '1',
})
export class RoleController {
	constructor(private readonly roleService: RoleService) {}

	@SerializeOptions({
		groups: ['admin'],
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createRoleArgs: CreateRoleDTO): Promise<Role> {
		return this.roleService.create(createRoleArgs);
	}
}
