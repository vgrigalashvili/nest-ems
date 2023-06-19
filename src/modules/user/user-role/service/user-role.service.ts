import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EntityCondition } from '../../../common/utils/types';
// import { Role } from '../../../role/entity';
import { User } from '../../entity';
import { UserRole } from '../entity';
import { CreateUserRoleDTO } from '../dto/create-user-role.dto';

@Injectable()
export class UserRoleService {
	constructor(
		@InjectRepository(UserRole)
		private userRoleRepo: Repository<UserRole>
	) {}

	/* create user role */
	async create(userRoleArgs: CreateUserRoleDTO): Promise<number[]> {
		const { id, roles } = userRoleArgs;

		// Find the existing roles for the user
		const existingRoles = await this.find({ id: id });

		// Filter out the roles that already exist for the user
		const newRoles = roles.filter((roleId) => !existingRoles.includes(roleId));

		// Create new UserRole entities for the new roles and save them to the database
		for (const roleId of newRoles) {
			const userRole = new UserRole();
			userRole.user_id = id as any;
			userRole.role_id = roleId as any;

			await this.userRoleRepo.save(this.userRoleRepo.create(userRole));
		}
		return this.find({ id: id });
	}

	/* find all user roles */
	async find(fields: EntityCondition<User>): Promise<number[]> {
		const { id } = fields;

		const userRoles = await this.userRoleRepo.find({
			where: { user_id: { id } },
			relations: ['role_id'],
		});

		return userRoles.map((userRole) => userRole.role_id.id);
	}
}
