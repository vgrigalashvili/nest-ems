import { NestFactory } from '@nestjs/core';

import { SeederModule } from './seeder.module';

import { UserSeedService } from './user-seed/service';
import { RoleSeedService } from './role-seed/service';
import { UserRoleSeedService } from './user-role-seed/service';

const runSeed = async () => {
	const app = await NestFactory.create(SeederModule);

	/* run user seed */
	try {
		await app.get(UserSeedService).run();
	} catch (ex) {
		throw new Error(`user seedService: ${ex.message}`);
	}

	/* run role seed */
	try {
		await app.get(RoleSeedService).run();
	} catch (ex) {
		throw new Error(`role seedService: ${ex.message}`);
	}

	/* run user-role seed */
	try {
		await app.get(UserRoleSeedService).run();
	} catch (ex) {
		throw new Error(`user-role seedService: ${ex.message}`);
	}

	await app.close();
};

void runSeed();
