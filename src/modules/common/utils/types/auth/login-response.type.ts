export type LoginResponseType = Readonly<{
	user_id: string;
	roles: number[];
	token: string;
}>;
