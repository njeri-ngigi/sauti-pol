import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNumber()
  readonly level: number;

  @ApiProperty()
  @IsOptional()
  readonly description?: string;
}

export class InstitutionDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly level: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly code: string;

  @ApiProperty()
  @IsNotEmpty()
  readonly address: string;
}

export class CreateInstitutionDto {
  @ApiProperty()
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
