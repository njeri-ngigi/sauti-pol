import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class InstitutionMiddleware {
  use(req: any, _: any, next: (error?: Error | any) => void) {
    const { institution, levels } = req.body;
    if (!institution) {
      throw new BadRequestException('institution is required');
    }

    if (!institution.name || institution.name.trim().length === 0) {
      throw new BadRequestException('institution name cannot be empty');
    }

    if (!institution.code || institution.code.trim().length === 0) {
      throw new BadRequestException('institution code cannot be empty');
    }

    if (!institution.level || institution.level.trim().length === 0) {
      throw new BadRequestException('institution level cannot be empty');
    }

    if (!institution.address || institution.address.trim().length === 0) {
      throw new BadRequestException('institution address cannot be empty');
    }

    if (levels) {
      for (const level of levels) {
        if (!level.name || level.name.trim().length === 0) {
          throw new BadRequestException(
            'for each level, level name cannot be empty',
          );
        }

        if (!level.level) {
          throw new BadRequestException(
            'for each level, level cannot be empty',
          );
        }

        level.level = Number(level.level);

        if (isNaN(level.level)) {
          throw new BadRequestException(
            'for each level, level must be a number',
          );
        }

        if (level.level < 0) {
          throw new BadRequestException(
            'for each level, level cannot be negative',
          );
        }
      }
    }

    next();
  }
}
