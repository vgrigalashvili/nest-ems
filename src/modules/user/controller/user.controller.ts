import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	UseGuards,
	Query,
	DefaultValuePipe,
	ParseIntPipe,
	HttpStatus,
	HttpCode,
	SerializeOptions,
	Delete,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDTO, UpdateUserDTO } from '../dto';

import { Roles } from '../../role/decorator';
import { RoleEnum } from '../../role/enum';
import { RoleGuard } from '../../role/guard';

import { InfinityPaginationResultType, NullableType } from '../../common/utils/types';

import { infinityPagination } from '../../common/utils/infinity-pagination';

import { User } from '../entity';
import { UserService } from '../service';

@ApiBearerAuth()
@Roles(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('user')
@Controller({ path: 'user', version: '1' })
export class UserController {
	constructor(private readonly userService: UserService) {}

	/* create user */
	@SerializeOptions({ groups: ['admin'] })
	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createUserArgs: CreateUserDTO): Promise<User> {
		return this.userService.create(createUserArgs);
	}

	/* find all users */
	@SerializeOptions({ groups: ['admin'] })
	@Get()
	@HttpCode(HttpStatus.OK)
	async findAll(
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
	): Promise<InfinityPaginationResultType<User>> {
		if (limit > 50) {
			limit = 50;
		}

		return infinityPagination(
			await this.userService.findManyWithPagination({
				page,
				limit,
			}),
			{ page, limit }
		);
	}

	/* find user by id: [string] */
	@SerializeOptions({ groups: ['admin'] })
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	findOne(@Param('id') id: string): Promise<NullableType<User>> {
		return this.userService.findOne({ id: id });
	}

	/* update user details */
	@SerializeOptions({ groups: ['admin'] })
	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	update(@Param('id') id: string, @Body() updateUserArgs: UpdateUserDTO): Promise<User> {
		return this.userService.update(id, updateUserArgs);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param('id') id: string): Promise<void> {
		return this.userService.softDelete(id);
	}
}
