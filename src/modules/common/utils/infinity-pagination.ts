import { IPaginationOptions, InfinityPaginationResultType } from './types';

export const infinityPagination = <T>(data: T[], options: IPaginationOptions): InfinityPaginationResultType<T> => {
	return {
		data,
		hasNextPage: data.length === options.limit,
	};
};
