import {
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  MinLength,
} from 'class-validator';

export class CreateEducationDto {
  @IsString()
  @MinLength(1)
  institution: string;

  @IsString()
  @MinLength(1)
  degree: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateEducationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  institution?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  degree?: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  order?: number;
}
