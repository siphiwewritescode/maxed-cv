import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsNumber,
  MinLength,
  ArrayMinSize,
} from 'class-validator';

export class CreateWorkExperienceDto {
  @IsString()
  @MinLength(1)
  jobTitle: string;

  @IsString()
  @MinLength(1)
  company: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  bulletPoints: string[];

  @IsOptional()
  @IsNumber()
  order?: number;
}

export class UpdateWorkExperienceDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  jobTitle?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  company?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  current?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  bulletPoints?: string[];

  @IsOptional()
  @IsNumber()
  order?: number;
}
