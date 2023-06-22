import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { User } from '../../user/entity';
import { Costumer } from '../entity/costumer';
import { CreateCostumerDTO } from '../dto';

@Injectable()
export class CostumerService {
	constructor(
		@InjectRepository(Costumer)
		private costumerRepo: Repository<Costumer>
	) {}

	/* create costumer */
	async create(costumerArgs: CreateCostumerDTO): Promise<Costumer> {
		const user: DeepPartial<User> = { id: costumerArgs.owner_id };

		try {
			return await this.costumerRepo.save(this.costumerRepo.create({ owner_id: user }));
		} catch (ex) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						id: `You already have a costumer account: ${ex.message}`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}
	}
}
