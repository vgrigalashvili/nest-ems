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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { User } from '../entity';

import { CreateUserDTO, UpdateUserDTO } from '../dto';

import { Role } from '../../common/role/decorator';
import { RoleEnum } from '../../common/role/enum';
import { RoleGuard } from '../../common/role/guard';

import { InfinityPaginationResultType } from '../../common/utils/types';
import { NullableType } from '../../common/utils/types';
import { infinityPagination } from '../../common/utils/infinity-pagination';

import { UserService } from '../service';

@ApiBearerAuth()
@Role(RoleEnum.admin)
@UseGuards(AuthGuard('jwt'), RoleGuard)
@ApiTags('Users')
@Controller({
	path: 'users',
	version: '1',
})
export class UserController {
	constructor(private readonly userService: UserService) {}

	@SerializeOptions({
		groups: ['admin'],
	})
	@Post()
	@HttpCode(HttpStatus.CREATED)
	create(@Body() createProfileDto: CreateUserDTO): Promise<User> {
		return this.userService.create(createProfileDto);
	}

	@SerializeOptions({
		groups: ['admin'],
	})
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

	@SerializeOptions({
		groups: ['admin'],
	})
	@Get(':id')
	@HttpCode(HttpStatus.OK)
	findOne(@Param('id') id: string): Promise<NullableType<User>> {
		return this.userService.findOne({ id: id });
	}

	@SerializeOptions({
		groups: ['admin'],
	})
	@Patch(':id')
	@HttpCode(HttpStatus.OK)
	update(@Param('id') id: string, @Body() updateUserArgs: UpdateUserDTO): Promise<User> {
		return this.userService.update(id, updateUserArgs);
	}
}
