import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
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

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    // Get or create profile
    let profile = await this.prisma.masterProfile.findUnique({
      where: { userId },
      include: {
        experiences: {
          orderBy: { order: 'asc' },
        },
        education: {
          orderBy: { order: 'asc' },
        },
        projects: {
          orderBy: { order: 'asc' },
        },
        certifications: {
          orderBy: { order: 'asc' },
        },
        skills: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // If no profile exists, create one with defaults from User table
    if (!profile) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      profile = await this.prisma.masterProfile.create({
        data: {
          userId,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email,
        },
        include: {
          experiences: {
            orderBy: { order: 'asc' },
          },
          education: {
            orderBy: { order: 'asc' },
          },
          projects: {
            orderBy: { order: 'asc' },
          },
          certifications: {
            orderBy: { order: 'asc' },
          },
          skills: {
            orderBy: { order: 'asc' },
          },
        },
      });
    }

    return profile;
  }

  async updatePersonalInfo(userId: string, dto: UpdatePersonalInfoDto) {
    // Ensure profile exists
    await this.getProfile(userId);

    return this.prisma.masterProfile.upsert({
      where: { userId },
      update: dto,
      create: {
        userId,
        ...dto,
      },
    });
  }

  // Work Experience CRUD
  async addWorkExperience(userId: string, dto: CreateWorkExperienceDto) {
    const profile = await this.getProfile(userId);

    // Auto-set order to max+1
    const maxOrder = await this.prisma.experience.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = dto.order ?? (maxOrder ? maxOrder.order + 1 : 0);

    return this.prisma.experience.create({
      data: {
        profileId: profile.id,
        position: dto.jobTitle, // Map jobTitle to position in schema
        company: dto.company,
        location: dto.location,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        bulletPoints: dto.bulletPoints,
        order,
      },
    });
  }

  async updateWorkExperience(
    userId: string,
    experienceId: string,
    dto: UpdateWorkExperienceDto,
  ) {
    // Verify ownership
    const experience = await this.prisma.experience.findUnique({
      where: { id: experienceId },
      include: { profile: true },
    });

    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    if (experience.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updateData: any = { ...dto };
    if (dto.jobTitle) {
      updateData.position = dto.jobTitle;
      delete updateData.jobTitle;
    }
    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    return this.prisma.experience.update({
      where: { id: experienceId },
      data: updateData,
    });
  }

  async deleteWorkExperience(userId: string, experienceId: string) {
    // Verify ownership
    const experience = await this.prisma.experience.findUnique({
      where: { id: experienceId },
      include: { profile: true },
    });

    if (!experience) {
      throw new NotFoundException('Work experience not found');
    }

    if (experience.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.experience.delete({
      where: { id: experienceId },
    });

    return { message: 'Work experience deleted successfully' };
  }

  // Education CRUD
  async addEducation(userId: string, dto: CreateEducationDto) {
    const profile = await this.getProfile(userId);

    const maxOrder = await this.prisma.education.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = dto.order ?? (maxOrder ? maxOrder.order + 1 : 0);

    return this.prisma.education.create({
      data: {
        profileId: profile.id,
        institution: dto.institution,
        degree: dto.degree,
        fieldOfStudy: dto.fieldOfStudy,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        location: dto.location,
        order,
      },
    });
  }

  async updateEducation(
    userId: string,
    educationId: string,
    dto: UpdateEducationDto,
  ) {
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
      include: { profile: true },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updateData: any = { ...dto };
    if (dto.startDate) {
      updateData.startDate = new Date(dto.startDate);
    }
    if (dto.endDate) {
      updateData.endDate = new Date(dto.endDate);
    }

    return this.prisma.education.update({
      where: { id: educationId },
      data: updateData,
    });
  }

  async deleteEducation(userId: string, educationId: string) {
    const education = await this.prisma.education.findUnique({
      where: { id: educationId },
      include: { profile: true },
    });

    if (!education) {
      throw new NotFoundException('Education not found');
    }

    if (education.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.education.delete({
      where: { id: educationId },
    });

    return { message: 'Education deleted successfully' };
  }

  // Project CRUD
  async addProject(userId: string, dto: CreateProjectDto) {
    const profile = await this.getProfile(userId);

    const maxOrder = await this.prisma.project.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = dto.order ?? (maxOrder ? maxOrder.order + 1 : 0);

    return this.prisma.project.create({
      data: {
        profileId: profile.id,
        name: dto.name,
        description: dto.description,
        url: dto.url,
        technologies: dto.technologies,
        order,
      },
    });
  }

  async updateProject(userId: string, projectId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { profile: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.project.update({
      where: { id: projectId },
      data: dto,
    });
  }

  async deleteProject(userId: string, projectId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { profile: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    if (project.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted successfully' };
  }

  // Certification CRUD
  async addCertification(userId: string, dto: CreateCertificationDto) {
    const profile = await this.getProfile(userId);

    const maxOrder = await this.prisma.certification.findFirst({
      where: { profileId: profile.id },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    const order = dto.order ?? (maxOrder ? maxOrder.order + 1 : 0);

    return this.prisma.certification.create({
      data: {
        profileId: profile.id,
        name: dto.name,
        issuer: dto.issuer,
        issueDate: dto.issueDate ? new Date(dto.issueDate) : null,
        credentialId: dto.credentialId,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        url: dto.url,
        order,
      },
    });
  }

  async updateCertification(
    userId: string,
    certificationId: string,
    dto: UpdateCertificationDto,
  ) {
    const certification = await this.prisma.certification.findUnique({
      where: { id: certificationId },
      include: { profile: true },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    if (certification.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const updateData: any = { ...dto };
    if (dto.issueDate) {
      updateData.issueDate = new Date(dto.issueDate);
    }
    if (dto.expiryDate) {
      updateData.expiryDate = new Date(dto.expiryDate);
    }

    return this.prisma.certification.update({
      where: { id: certificationId },
      data: updateData,
    });
  }

  async deleteCertification(userId: string, certificationId: string) {
    const certification = await this.prisma.certification.findUnique({
      where: { id: certificationId },
      include: { profile: true },
    });

    if (!certification) {
      throw new NotFoundException('Certification not found');
    }

    if (certification.profile.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.certification.delete({
      where: { id: certificationId },
    });

    return { message: 'Certification deleted successfully' };
  }

  // Skills - Replace all
  async updateSkills(userId: string, dto: UpdateSkillsDto) {
    const profile = await this.getProfile(userId);

    // Replace all skills in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Delete existing skills
      await tx.skill.deleteMany({
        where: { profileId: profile.id },
      });

      // Create new skills
      if (dto.skills.length > 0) {
        await tx.skill.createMany({
          data: dto.skills.map((skill) => ({
            profileId: profile.id,
            name: skill.name,
            order: skill.order,
            category: skill.category,
          })),
        });
      }

      // Return updated skills
      return tx.skill.findMany({
        where: { profileId: profile.id },
        orderBy: { order: 'asc' },
      });
    });
  }

  // Reorder section items
  async reorderSection(userId: string, dto: ReorderDto) {
    const profile = await this.getProfile(userId);

    // Verify all items belong to the user and update their order
    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        let model: any;
        let where: any = { id: item.id };

        switch (dto.section) {
          case 'experience':
            model = tx.experience;
            break;
          case 'education':
            model = tx.education;
            break;
          case 'projects':
            model = tx.project;
            break;
          case 'certifications':
            model = tx.certification;
            break;
          case 'skills':
            model = tx.skill;
            break;
        }

        // Verify ownership
        const record = await model.findUnique({
          where,
          include: { profile: true },
        });

        if (!record || record.profile.userId !== userId) {
          throw new ForbiddenException('Access denied');
        }

        // Update order
        await model.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }

      return { message: 'Section reordered successfully' };
    });
  }
}
