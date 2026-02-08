import {
  IsArray,
  IsString,
  IsNumber,
  ValidateNested,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

class SkillItemDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsNumber()
  order: number;

  @IsString()
  @MinLength(1)
  category: string;
}

export class UpdateSkillsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills: SkillItemDto[];
}
