import { User } from '../../../../user/entity';

export type LoginResponseType = Readonly<{
	token: string;
	user: User;
}>;
