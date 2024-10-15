import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CreateInstitutionDto,
  CreateInstitutionDtoResponse,
} from '../dto/institution.dto';
import { RoleGuard, RolesGuard } from '../user/role.guard';
import { Roles } from '../user/role.provider';
import { Level } from './institution.model';
import { InstitutionService } from './institution.service';

@Controller('institutions')
@UseGuards(RoleGuard)
export class InstitutionController {
  constructor(private readonly institutionService: InstitutionService) {}

  @RolesGuard(Roles.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createInstitution(
    @Body() institutionData: CreateInstitutionDto,
  ): Promise<CreateInstitutionDtoResponse> {
    const { institution, levels } = institutionData;
    const dbInstitution =
      await this.institutionService.createInstitution(institution);

    let dbLevels: Level[];
    if (levels && levels.length > 0) {
      dbLevels = await this.institutionService.createLevels(
        levels,
        dbInstitution.id,
      );
    }

    return { institution: dbInstitution, levels: dbLevels };
  }
}
