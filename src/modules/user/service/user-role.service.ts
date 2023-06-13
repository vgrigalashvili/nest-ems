import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';

import { EntityCondition } from '../../common/utils/types';

import { User, UserRole } from '../entity';

@Injectable()
export class UserRoleService {
	constructor(
		@InjectRepository(UserRole)
		private userRoleRepo: Repository<UserRole>
	) {}

	async getUserRoles(fields: EntityCondition<User>): Promise<number[]> {
		const { id } = fields;

		const userRoles = await this.userRoleRepo.find({
			where: { user_id: Equal(id) },
			relations: ['role_id'],
		});

		return userRoles.map((userRole) => userRole.role_id.id);
	}
}
