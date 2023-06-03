import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { EntityHelper } from '../utils';

/**
 * This module exports the [Common] class, which is used to define the common fields for all entities in the system.
 * These fields include an ID, the user who created the entity, the date and time it was created,
 * the user who last modified the entity, and the date and time it was last modified.
 *
 */
export class Common extends EntityHelper {
	/**
	 * The ID of the entity.
	 *
	 * @type {number}
	 */
	@PrimaryColumn({ type: 'uuid', default: uuidv4() })
	id: string;

	/**
	 * The ID of the user who created the entity.
	 *
	 * @type {number}
	 */
	@Column({ type: 'bigint', nullable: true, default: null })
	created_by: number;

	/**
	 * The date and time the entity was created.
	 *
	 * @type {Date}
	 */
	@CreateDateColumn({ type: 'timestamp with time zone', nullable: false })
	created_at: Date;

	/**
	 * The ID of the user who last modified the entity.
	 *
	 * @type {number}
	 */
	@Column({ type: 'bigint', nullable: true, default: null })
	modified_by: number;

	/**
	 * The date and time the entity was last modified.
	 *
	 * @type {Date}
	 */
	@UpdateDateColumn({ type: `timestamp with time zone`, nullable: true, default: null })
	modified_at: Date;
}
