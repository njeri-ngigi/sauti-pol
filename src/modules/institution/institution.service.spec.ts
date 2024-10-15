import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuid } from 'uuid';
import { SEQUELIZE } from '../../core/constants';
import { InstitutionDto, LevelDto } from '../dto/institution.dto';
import { Institution } from './institution.model';
import { InstitutionModule } from './institution.module';
import { InstitutionService } from './institution.service';

describe('InstitutionService', () => {
  let mockModule: TestingModule;
  let institutionService: InstitutionService;

  beforeAll(async () => {
    mockModule = await Test.createTestingModule({
      imports: [InstitutionModule],
    }).compile();
    institutionService = mockModule.get<InstitutionService>(InstitutionService);
  });

  afterAll(async () => {
    await mockModule.get(SEQUELIZE).close();
  });

  describe('findOneByNameOrCode', () => {
    const institution: InstitutionDto = {
      name: faker.company.name(),
      code: faker.string.alphanumeric(5),
      level: 'country',
      address: faker.location.streetAddress(),
    };

    beforeAll(async () => {
      await institutionService.createInstitution(institution);
    });

    it('should return an institution with the name provided', async () => {
      const dbInstitution = await institutionService.findOneByNameOrCode({
        name: institution.name,
        code: 'some-code',
      });

      expect(dbInstitution).toMatchObject(institution);
    });

    it('should return an institution with the code provided', async () => {
      const dbInstitution = await institutionService.findOneByNameOrCode({
        name: 'some-name',
        code: institution.code,
      });

      expect(dbInstitution).toMatchObject(institution);
    });

    it('should return an institution with the name and code provided', async () => {
      const dbInstitution = await institutionService.findOneByNameOrCode({
        name: institution.name,
        code: institution.code,
      });

      expect(dbInstitution).toMatchObject(institution);
    });

    it('should return null if institution not found', async () => {
      const dbInstitution = await institutionService.findOneByNameOrCode({
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
      });

      expect(dbInstitution).toBeNull();
    });
  });

  describe('createInstitution', () => {
    it('should create institution successfully', async () => {
      const institution: InstitutionDto = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      };

      const dbInstitution =
        await institutionService.createInstitution(institution);

      const dbLevel =
        await institutionService.findLevelsByInstitutionIdNameAndLevel({
          institutionId: dbInstitution.id,
          name: institution.level,
          level: 0,
        });

      expect(dbInstitution).toMatchObject(institution);
      expect(dbLevel).toMatchObject({
        institutionId: dbInstitution.id,
        name: institution.level,
        level: 0,
      });
    });

    it('should throw a ConflictException if institution with name and code already exists', async () => {
      const institution: InstitutionDto = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      };

      await institutionService.createInstitution(institution);

      try {
        await institutionService.createInstitution(institution);
      } catch (error) {
        expect(error.message).toBe(
          'institution with name or code already exists',
        );
      }
    });

    it('should throw a ConflictException if institution with name already exists', async () => {
      const institution: InstitutionDto = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      };

      await institutionService.createInstitution(institution);

      try {
        await institutionService.createInstitution({
          ...institution,
          code: faker.string.alphanumeric(5),
        });
      } catch (error) {
        expect(error.message).toBe(
          'institution with name or code already exists',
        );
      }
    });

    it('should throw a ConflictException if institution with code already exists', async () => {
      const institution: InstitutionDto = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      };

      await institutionService.createInstitution(institution);

      try {
        await institutionService.createInstitution({
          ...institution,
          name: faker.company.name(),
        });
      } catch (error) {
        expect(error.message).toBe(
          'institution with name or code already exists',
        );
      }
    });
  });

  describe('findLevelsByInstitutionIdNameAndLevel', () => {
    it('should return a level with the institutionId, name, and level provided', async () => {
      const institution: InstitutionDto = {
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      };

      const dbInstitution =
        await institutionService.createInstitution(institution);

      const dbLevel =
        await institutionService.findLevelsByInstitutionIdNameAndLevel({
          institutionId: dbInstitution.id,
          name: institution.level,
          level: 0,
        });

      expect(dbLevel).toMatchObject({
        institutionId: dbInstitution.id,
        name: institution.level,
        level: 0,
      });
    });

    it('should return null if level not found', async () => {
      const dbLevel =
        await institutionService.findLevelsByInstitutionIdNameAndLevel({
          institutionId: uuid(),
          name: 'some-name',
          level: 2,
        });

      expect(dbLevel).toBeNull();
    });
  });

  describe('sanitizeLevels', () => {
    it('should remove levels with missing name or level', () => {
      const levels: LevelDto[] = [
        { name: 'level-1', level: 1 },
        { name: 'level-2', level: undefined },
        { name: undefined, level: 3 },
      ];

      const sanitizedLevels = institutionService.sanitizeLevels(levels);

      expect(sanitizedLevels).toHaveLength(1);
    });
  });

  describe('createLevels', () => {
    let institution: Institution;

    beforeAll(async () => {
      institution = await institutionService.createInstitution({
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      });
    });

    it('should create levels successfully', async () => {
      const levels: LevelDto[] = [
        { name: 'level-1', level: 1 },
        { name: 'level-2', level: 2 },
      ];

      const dbLevels = await institutionService.createLevels(
        levels,
        institution.id,
      );

      expect(dbLevels).toHaveLength(2);
      expect(dbLevels).toMatchObject([
        { name: 'level-1', level: 1, institutionId: institution.id },
        { name: 'level-2', level: 2, institutionId: institution.id },
      ]);
    });

    it('should skip creating level if level with institutionId, name and level already exists', async () => {
      const levels: LevelDto[] = [
        { name: 'level-3', level: 3 },
        { name: 'level-3', level: 3 },
        { name: 'level-1', level: 1 },
      ];

      const dbLevels = await institutionService.createLevels(
        levels,
        institution.id,
      );

      expect(dbLevels).toHaveLength(1);
      expect(dbLevels).toMatchObject([
        { name: 'level-3', level: 3, institutionId: institution.id },
      ]);
    });

    it('should create levels successfully if name and level are duplicated, but on different institutions', async () => {
      const institution2 = await institutionService.createInstitution({
        name: faker.company.name(),
        code: faker.string.alphanumeric(5),
        level: 'country',
        address: faker.location.streetAddress(),
      });

      const levels: LevelDto[] = [
        { name: 'level-4', level: 4 },
        { name: 'level-5', level: 5 },
      ];

      const dbLevels = await institutionService.createLevels(
        levels,
        institution.id,
      );

      const dbLevels2 = await institutionService.createLevels(
        levels,
        institution2.id,
      );

      expect(dbLevels).toHaveLength(2);
      expect(dbLevels).toMatchObject([
        { name: 'level-4', level: 4, institutionId: institution.id },
        { name: 'level-5', level: 5, institutionId: institution.id },
      ]);

      expect(dbLevels2).toHaveLength(2);
      expect(dbLevels2).toMatchObject([
        { name: 'level-4', level: 4, institutionId: institution2.id },
        { name: 'level-5', level: 5, institutionId: institution2.id },
      ]);
    });
  });
});
