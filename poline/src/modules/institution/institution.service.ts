import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import {
  DIVISION_REPOSITORY,
  INSTITUTION_REPOSITORY,
  LEVEL_REPOSITORY,
} from '../../core/constants';
import { InstitutionDto, LevelDto } from '../dto/institution.dto';
import { Division, Institution, Level } from './institution.model';

@Injectable()
export class InstitutionService {
  constructor(
    @Inject(INSTITUTION_REPOSITORY)
    private readonly institutionModel: typeof Institution,
    @Inject(LEVEL_REPOSITORY)
    private readonly levelModel: typeof Level,
    @Inject(DIVISION_REPOSITORY)
    private readonly divisionModel: typeof Division,
  ) {}

  findOneByNameOrCode({
    name,
    code,
  }: Pick<InstitutionDto, 'name' | 'code'>): Promise<Institution> {
    return this.institutionModel.findOne<Institution>({
      where: {
        [Op.or]: [
          name ? { name: { [Op.eq]: name } } : null,
          code ? { code: { [Op.eq]: code } } : null,
        ],
      },
    });
  }

  async createInstitution(institution: InstitutionDto): Promise<Institution> {
    const dbInstitutionByNameOrCode = await this.findOneByNameOrCode({
      name: institution.name,
      code: institution.code,
    });

    if (dbInstitutionByNameOrCode) {
      throw new ConflictException(
        'institution with name or code already exists',
      );
    }

    // create institution
    const dbInstitution =
      await this.institutionModel.create<Institution>(institution);

    // create top level
    const TOP_LEVEL = 0;
    await this.levelModel.create<Level>({
      name: institution.level,
      level: TOP_LEVEL,
      institutionId: dbInstitution.id,
    });

    return dbInstitution;
  }

  findLevelsByInstitutionIdNameAndLevel({
    institutionId,
    name,
    level,
  }): Promise<Level> {
    return this.levelModel.findOne<Level>({
      where: {
        [Op.and]: [
          { institutionId: { [Op.eq]: institutionId } },
          { name: { [Op.eq]: name } },
          { level: { [Op.eq]: level } },
        ],
      },
    });
  }

  /**
   * name and level are required columns
   * sanitizeLevels removes levels without a name or level
   */
  sanitizeLevels(levels: LevelDto[]): LevelDto[] {
    const sanitizedLevels: LevelDto[] = [];

    for (const level of levels) {
      if (!level.level) {
        console.log(`Skipping "${level.name}", does not have a level`);
        continue;
      }

      if (!level.name) {
        console.log(
          `Skipping level with level "${level.level}", does not have a name`,
        );
        continue;
      }

      sanitizedLevels.push(level);
    }

    return sanitizedLevels;
  }

  async createLevels(
    levels: LevelDto[],
    institutionId: string,
  ): Promise<Level[]> {
    const dbLevels: Level[] = [];

    const sanitizedLevels = this.sanitizeLevels(levels);
    for (const level of sanitizedLevels) {
      const [dbLevel, created] = await this.levelModel.findOrCreate<Level>({
        where: {
          institutionId,
          name: level.name,
          level: level.level,
        },
        defaults: {
          ...level,
          institutionId,
        },
      });

      if (created) {
        console.log(`Created level: "${dbLevel.name}"`);
        dbLevels.push(dbLevel);
      } else {
        console.log(`Skipping, level name: "${dbLevel.name}" already exists.`);
      }
    }

    return dbLevels;
  }
}
