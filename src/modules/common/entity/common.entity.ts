import { Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { EntityHelper } from '../utils';

export class Common extends EntityHelper {
	@Column({ type: 'varchar', nullable: true, default: null })
	created_by: string;

	@CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
	created_at: Date;

	@Column({ type: 'varchar', nullable: true, default: null })
	modified_by: string;

	@UpdateDateColumn({ type: `timestamp with time zone`, nullable: true, default: null })
	modified_at: Date;
}
