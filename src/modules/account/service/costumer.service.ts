import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Costumer } from '../entity';
import { CreateCostumerDTO } from '../dto';

@Injectable()
export class CostumerService {
	constructor(
		@InjectRepository(Costumer)
		private costumerRepo: Repository<Costumer>
	) {}

	/* create costumer */
	async create(costumerArgs: CreateCostumerDTO): Promise<Costumer> {
		try {
			return await this.costumerRepo.save(this.costumerRepo.create(costumerArgs));
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
