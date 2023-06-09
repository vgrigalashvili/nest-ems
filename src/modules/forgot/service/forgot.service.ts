import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DeepPartial, Repository } from 'typeorm';
import { Forgot } from '../entity';
import { NullableType, FindOptions } from '../../common/utils/types';

@Injectable()
export class ForgotService {
	constructor(
		@InjectRepository(Forgot)
		private readonly forgotRepo: Repository<Forgot>
	) {}

	async findOne(options: FindOptions<Forgot>): Promise<NullableType<Forgot>> {
		return this.forgotRepo.findOne({
			where: options.where,
		});
	}

	async findMany(options: FindOptions<Forgot>): Promise<Forgot[]> {
		return this.forgotRepo.find({
			where: options.where,
		});
	}

	async create(data: DeepPartial<Forgot>): Promise<Forgot> {
		return this.forgotRepo.save(this.forgotRepo.create(data));
	}

	async softDelete(id: number): Promise<void> {
		await this.forgotRepo.softDelete(id);
	}
}
