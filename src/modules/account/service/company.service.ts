import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Company } from '../entity';
import { CreateCompanyDTO } from '../dto';

@Injectable()
export class CompanyService {
	constructor(
		@InjectRepository(Company)
		private companyRepo: Repository<Company>
	) {}

	/* create company */
	async create(companyArgs: CreateCompanyDTO): Promise<Company> {
		try {
			return await this.companyRepo.save(this.companyRepo.create(companyArgs));
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
