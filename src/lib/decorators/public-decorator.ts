import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from 'src/lib/constants';

export const Public = () => SetMetadata(IS_PUBLIC, true);
