import {
  IsEnum,
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum Section {
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  PROJECTS = 'projects',
  CERTIFICATIONS = 'certifications',
  SKILLS = 'skills',
}

class ReorderItemDto {
  @IsString()
  id: string;

  @IsNumber()
  order: number;
}

export class ReorderDto {
  @IsEnum(Section)
  section: Section;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItemDto)
  items: ReorderItemDto[];
}
