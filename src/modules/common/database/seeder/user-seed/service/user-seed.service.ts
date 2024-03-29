import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../../../user/entity';

@Injectable()
export class UserSeedService {
	constructor(
		@InjectRepository(User)
		private userRepo: Repository<User>
	) {}

	async run() {
		const userCount = await this.userRepo.count();
		if (userCount === 0) {
			await this.userRepo.save(
				this.userRepo.create({
					firstName: 'test',
					lastName: 'user',
					email: 'test1@example.com',
					password: 'secret',
					provider: 'email',
					mail_verified: true,
				})
			);
		}
	}
}
