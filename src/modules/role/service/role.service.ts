import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entity';
import { Repository } from 'typeorm';
import { CreateRoleDTO } from '../dto';
import { IPaginationOptions } from 'src/modules/common/utils/interface';

@Injectable()
export class RoleService {
	constructor(@InjectRepository(Role) private roleRepo: Repository<Role>) {}

	/* create role */
	create(createRoleArgs: CreateRoleDTO): Promise<Role> {
		return this.roleRepo.save(this.roleRepo.create(createRoleArgs));
	}

	/* find roles */
	findManyWithPagination(paginationOptions: IPaginationOptions): Promise<Role[]> {
		return this.roleRepo.find({
			skip: (paginationOptions.page - 1) * paginationOptions.limit,
			take: paginationOptions.limit,
		});
	}
}
