import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';

import { IPaginationOptions } from '../../common/utils/interface';
import { EntityCondition } from '../../common/utils/types';

import { CreateUserDTO } from '../dto';
import { User } from '../entity';
import { NullableType } from '../../common/utils/types';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private usersRepository: Repository<User>
	) {}

	create(createUserArgs: CreateUserDTO): Promise<User> {
		return this.usersRepository.save(this.usersRepository.create(createUserArgs));
	}

	findManyWithPagination(paginationOptions: IPaginationOptions): Promise<User[]> {
		return this.usersRepository.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});
	}

	findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
		return this.usersRepository.findOne({
			where: fields,
		});
	}

	update(id: string, updateArgs: DeepPartial<User>): Promise<User> {
		return this.usersRepository.save(
			this.usersRepository.create({
				id,
				...updateArgs,
			})
		);
	}
}
