import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { IPaginationOptions } from '../../common/utils/interface';
import { EntityCondition, NullableType } from '../../common/utils/types';

import { User } from '../entity';
import { CreateUserDTO } from '../dto';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>
	) {}

	create(createUserArgs: CreateUserDTO): Promise<User> {
		return this.userRepo.save(this.userRepo.create(createUserArgs));
	}

	findManyWithPagination(paginationOptions: IPaginationOptions): Promise<User[]> {
		return this.userRepo.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});
	}

	findOne(fields: EntityCondition<User>): Promise<NullableType<User>> {
		return this.userRepo.findOne({
			where: fields,
		});
	}

	update(id: string, updateArgs: DeepPartial<User>): Promise<User> {
		return this.userRepo.save(
			this.userRepo.create({
				id,
				...updateArgs,
			})
		);
	}

	async softDelete(id: string): Promise<void> {
		await this.userRepo.softDelete(id);
	}
}
