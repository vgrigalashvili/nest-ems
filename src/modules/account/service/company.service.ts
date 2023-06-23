import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';

import { User } from '../../user/entity';
import { Company } from '../entity';
import { CreateCompanyDTO } from '../dto';

@Injectable()
export class CompanyService {
	constructor(
		@InjectRepository(Company)
		private companyRepo: Repository<Company>
	) {}

	/* create company */
	async create(owner_id: string, companyArgs: CreateCompanyDTO): Promise<Company> {
		const user: DeepPartial<User> = { id: owner_id };
		const { public_id, name } = companyArgs;
		try {
			return await this.companyRepo.save(this.companyRepo.create({ owner_id: user, public_id: public_id, name: name }));
		} catch (ex) {
			throw new HttpException(
				{
					status: HttpStatus.UNPROCESSABLE_ENTITY,
					errors: {
						id: `You already have a company account: ${ex.message}`,
					},
				},
				HttpStatus.UNPROCESSABLE_ENTITY
			);
		}
	}
}
