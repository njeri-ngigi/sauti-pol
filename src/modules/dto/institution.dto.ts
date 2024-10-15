import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Institution, Level } from '../institution/institution.model';

export class LevelDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  readonly level: number;

  @IsOptional()
  readonly description?: string;
}

export class InstitutionDto {
  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly level: string;

  @IsNotEmpty()
  readonly code: string;

  @IsNotEmpty()
  readonly address: string;
}

export class CreateInstitutionDto {
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => InstitutionDto)
  readonly institution: InstitutionDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => LevelDto)
  readonly levels: LevelDto[];
}

export class CreateInstitutionDtoResponse {
  readonly institution: Institution;
  readonly levels: Level[];
}
