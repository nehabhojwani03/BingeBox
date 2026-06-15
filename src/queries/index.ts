import { mergeQueryKeys } from '@lukemorales/query-key-factory';

import { movies } from './movies';

export const queries = mergeQueryKeys(movies);
