import { User } from '../../../../user/entity';

export type JwtPayloadType = Pick<User, 'id' | 'email'> & {
	iat: number;
	exp: number;
};
