import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { User } from '../../../../../user/entity';
import { Role, UserRole } from '../../../../../role/entity';
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
		const userExists = await this.userRepo.findOne({ where: { email: 'lado.grigalashvili@gmail.com' } });

		if (userExists) {
			const userId = userExists.id;
			const roleId = `${RoleEnum.admin}`;
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
