import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { AuthenticatedGuard } from '../auth/guards/authenticated.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { UpdatePersonalInfoDto } from './dto/update-personal-info.dto';
import {
  CreateWorkExperienceDto,
  UpdateWorkExperienceDto,
} from './dto/work-experience.dto';
import { CreateEducationDto, UpdateEducationDto } from './dto/education.dto';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import {
  CreateCertificationDto,
  UpdateCertificationDto,
} from './dto/certification.dto';
import { UpdateSkillsDto } from './dto/update-skills.dto';
import { ReorderDto } from './dto/reorder.dto';

@Controller('profile')
@UseGuards(AuthenticatedGuard)
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get()
  async getProfile(@CurrentUser() user: any) {
    return this.profileService.getProfile(user.id);
  }

  @Patch('personal-info')
  async updatePersonalInfo(
    @CurrentUser() user: any,
    @Body() dto: UpdatePersonalInfoDto,
  ) {
    return this.profileService.updatePersonalInfo(user.id, dto);
  }

  // Work Experience endpoints
  @Post('experience')
  async addWorkExperience(
    @CurrentUser() user: any,
    @Body() dto: CreateWorkExperienceDto,
  ) {
    return this.profileService.addWorkExperience(user.id, dto);
  }

  @Put('experience/:id')
  async updateWorkExperience(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateWorkExperienceDto,
  ) {
    return this.profileService.updateWorkExperience(user.id, id, dto);
  }

  @Delete('experience/:id')
  async deleteWorkExperience(@CurrentUser() user: any, @Param('id') id: string) {
    return this.profileService.deleteWorkExperience(user.id, id);
  }

  // Education endpoints
  @Post('education')
  async addEducation(@CurrentUser() user: any, @Body() dto: CreateEducationDto) {
    return this.profileService.addEducation(user.id, dto);
  }

  @Put('education/:id')
  async updateEducation(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateEducationDto,
  ) {
    return this.profileService.updateEducation(user.id, id, dto);
  }

  @Delete('education/:id')
  async deleteEducation(@CurrentUser() user: any, @Param('id') id: string) {
    return this.profileService.deleteEducation(user.id, id);
  }

  // Project endpoints
  @Post('projects')
  async addProject(@CurrentUser() user: any, @Body() dto: CreateProjectDto) {
    return this.profileService.addProject(user.id, dto);
  }

  @Put('projects/:id')
  async updateProject(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ) {
    return this.profileService.updateProject(user.id, id, dto);
  }

  @Delete('projects/:id')
  async deleteProject(@CurrentUser() user: any, @Param('id') id: string) {
    return this.profileService.deleteProject(user.id, id);
  }

  // Certification endpoints
  @Post('certifications')
  async addCertification(
    @CurrentUser() user: any,
    @Body() dto: CreateCertificationDto,
  ) {
    return this.profileService.addCertification(user.id, dto);
  }

  @Put('certifications/:id')
  async updateCertification(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ) {
    return this.profileService.updateCertification(user.id, id, dto);
  }

  @Delete('certifications/:id')
  async deleteCertification(@CurrentUser() user: any, @Param('id') id: string) {
    return this.profileService.deleteCertification(user.id, id);
  }

  // Skills endpoint
  @Put('skills')
  async updateSkills(@CurrentUser() user: any, @Body() dto: UpdateSkillsDto) {
    return this.profileService.updateSkills(user.id, dto);
  }

  // Reorder endpoint
  @Patch('reorder')
  async reorderSection(@CurrentUser() user: any, @Body() dto: ReorderDto) {
    return this.profileService.reorderSection(user.id, dto);
  }
}
