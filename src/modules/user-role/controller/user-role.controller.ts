import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, SerializeOptions, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../role/decorator';
import { RoleGuard } from '../../role/guard';
import { RoleEnum } from '../../role/enum';

import { UserRoleService } from '../service';
import { CreateUserRoleDTO } from '../dto/create-user-role.dto';
// import { UpdateUserRoleDTO } from '../dto';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('user-role')
@Controller({ path: 'user-role', version: '1' })
export class UserRoleController {
	constructor(private readonly userRoleService: UserRoleService) {}
	/* create user roles */
	@SerializeOptions({ groups: ['admin'] })
	@Post()
	@HttpCode(HttpStatus.OK)
	create(@Body() createUserRoleArgs: CreateUserRoleDTO): Promise<number[]> {
		return this.userRoleService.create(createUserRoleArgs);
	}

	/* find user roles */
	@SerializeOptions({ groups: ['admin'] })
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	findMany(@Param('id') id: string): Promise<number[]> {
		return this.userRoleService.findUserRoles({ id: id });
	}
}
