import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { User, UserRole } from '../../../../../user/entity';
import { Role } from '../../../../../role/entity';
import { RoleEnum } from '../../../../../role/enum';

@Injectable()
export class UserRoleSeedService {
	constructor(
		@InjectRepository(UserRole)
		private userRoleRepo: Repository<UserRole>,
		@InjectRepository(User)
		private userRepo: Repository<User>
	) {}

	async run() {
		const userExists = await this.userRepo.findOne({ where: { email: 'admin@testmail.com' } });

		if (userExists) {
			const userId: string = userExists.id;
			const roleId: number = RoleEnum.admin;
			await this.userRoleRepo.save(
				this.userRoleRepo.create([
					{
						user_id: userId as DeepPartial<User>,
						role_id: roleId as DeepPartial<Role>,
					},
				])
			);
		}
	}
}
