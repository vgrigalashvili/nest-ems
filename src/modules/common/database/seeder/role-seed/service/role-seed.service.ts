import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Role } from '../../../../../role/entity';
import { RoleEnum } from '../../../../../role/enum';

@Injectable()
export class RoleSeedService {
	constructor(
		@InjectRepository(Role)
		private roleRepo: Repository<Role>
	) {}

	async run() {
		const existsAdmin = await this.roleRepo.findOne({ where: { name: 'admin' } });

		if (!existsAdmin) {
			await this.roleRepo.save(
				this.roleRepo.create({
					id: RoleEnum.admin,
					name: 'admin',
				})
			);
		}

		const existsUser = await this.roleRepo.findOne({ where: { name: 'user' } });

		if (!existsUser) {
			await this.roleRepo.save(
				this.roleRepo.create({
					id: RoleEnum.user,
					name: 'user',
				})
			);
		}
	}
}
