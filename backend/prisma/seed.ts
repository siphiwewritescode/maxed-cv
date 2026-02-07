import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with South African sample data...');

  // Clear existing data in reverse dependency order
  console.log('Clearing existing data...');
  await prisma.generatedCV.deleteMany();
  await prisma.job.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.education.deleteMany();
  await prisma.project.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.masterProfile.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Existing data cleared');

  // Create test user
  console.log('\nCreating test user...');
  const user = await prisma.user.create({
    data: {
      email: 'test@maxedcv.com',
      name: 'Sipho Ngwenya',
      emailVerified: new Date(),
      createdAt: new Date(),
    },
  });
  console.log(`✓ Test user created: ${user.email}`);

  // Create Master Profile with SA-themed data
  console.log('\nCreating Master Profile...');
  const masterProfile = await prisma.masterProfile.create({
    data: {
      userId: user.id,
      firstName: 'Sipho',
      lastName: 'Ngwenya',
      email: 'sipho.ngwenya@email.com',
      phone: '+27 82 123 4567',
      location: 'Cape Town, Western Cape, South Africa',
      headline: 'Senior Full-Stack Developer | TypeScript | React | Node.js',
      summary:
        'Passionate software engineer with 5+ years building scalable web applications. Based in Cape Town with experience across fintech and e-commerce domains. Experienced in Agile methodologies and mentoring junior developers.',
      noticePeriod: '1 month',
    },
  });
  console.log(`✓ Master Profile created for: ${masterProfile.email}`);

  // Create 3 Experience entries
  console.log('\nCreating work experiences...');
  const experiences = await Promise.all([
    prisma.experience.create({
      data: {
        profileId: masterProfile.id,
        company: 'Yoco',
        position: 'Senior Full-Stack Developer',
        location: 'Cape Town, South Africa',
        startDate: new Date('2021-03-01'),
        endDate: null, // Current position
        description:
          'Building payment processing solutions for small businesses across South Africa.',
        bulletPoints: [
          'Architected microservices handling 100,000+ daily payment transactions using NestJS and PostgreSQL',
          'Reduced API response times by 40% through query optimisation and Redis caching',
          'Mentored 3 junior developers in TypeScript best practices and code review processes',
          'Led migration from monolithic architecture to event-driven microservices',
        ],
        order: 0,
      },
    }),
    prisma.experience.create({
      data: {
        profileId: masterProfile.id,
        company: 'Takealot',
        position: 'Full-Stack Developer',
        location: 'Cape Town, South Africa',
        startDate: new Date('2019-06-01'),
        endDate: new Date('2021-02-28'),
        description:
          "Developed features for South Africa's largest e-commerce platform.",
        bulletPoints: [
          'Built real-time inventory management system using React and Node.js serving 500+ sellers',
          'Implemented search optimisation improving product conversion rate by 15%',
          'Collaborated with product teams using Agile methodologies across 3 squads',
          'Developed automated testing pipeline reducing bug reports by 30%',
        ],
        order: 1,
      },
    }),
    prisma.experience.create({
      data: {
        profileId: masterProfile.id,
        company: 'OfferZen',
        position: 'Junior Developer',
        location: 'Cape Town, South Africa',
        startDate: new Date('2018-01-01'),
        endDate: new Date('2019-05-31'),
        description: 'Worked on candidate matching platform for tech recruitment.',
        bulletPoints: [
          'Developed candidate matching algorithms using Python and PostgreSQL',
          'Built responsive web interfaces using React and TypeScript',
          'Participated in company-wide hackathons, winning Best Technical Innovation',
        ],
        order: 2,
      },
    }),
  ]);
  console.log(`✓ Created ${experiences.length} work experiences`);

  // Create Skills (9 items with categories)
  console.log('\nCreating skills...');
  const skills = await Promise.all([
    // Languages
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'TypeScript', category: 'Languages' },
    }),
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'JavaScript', category: 'Languages' },
    }),
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'Python', category: 'Languages' },
    }),
    // Frontend
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'React', category: 'Frontend' },
    }),
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'Next.js', category: 'Frontend' },
    }),
    // Backend
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'Node.js', category: 'Backend' },
    }),
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'NestJS', category: 'Backend' },
    }),
    // Databases
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'PostgreSQL', category: 'Databases' },
    }),
    // DevOps
    prisma.skill.create({
      data: { profileId: masterProfile.id, name: 'Docker', category: 'DevOps' },
    }),
  ]);
  console.log(`✓ Created ${skills.length} skills`);

  // Create 2 Projects
  console.log('\nCreating projects...');
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        profileId: masterProfile.id,
        name: 'SA Tourism Portal',
        description:
          'Next.js tourism booking platform for Western Cape attractions. Integrated with local payment providers and SA tourism APIs.',
        url: 'https://github.com/sipho/sa-tourism',
        technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
      },
    }),
    prisma.project.create({
      data: {
        profileId: masterProfile.id,
        name: 'Load Shedding Tracker',
        description:
          'Real-time Eskom load shedding schedule app for SA residents. WebSocket-based updates with Redis caching for optimal performance.',
        url: 'https://github.com/sipho/load-shedding-tracker',
        technologies: ['React', 'Node.js', 'WebSocket', 'Redis'],
      },
    }),
  ]);
  console.log(`✓ Created ${projects.length} projects`);

  // Create 1 Education entry
  console.log('\nCreating education...');
  const education = await prisma.education.create({
    data: {
      profileId: masterProfile.id,
      institution: 'University of Cape Town',
      degree: 'BSc Computer Science',
      fieldOfStudy: 'Computer Science',
      startDate: new Date('2015-02-01'),
      endDate: new Date('2018-12-01'),
      location: 'Cape Town, South Africa',
    },
  });
  console.log(`✓ Created education entry: ${education.degree}`);

  // Create 1 Certification
  console.log('\nCreating certification...');
  const certification = await prisma.certification.create({
    data: {
      profileId: masterProfile.id,
      name: 'AWS Certified Solutions Architect - Associate',
      issuer: 'Amazon Web Services',
      issueDate: new Date('2023-06-15'),
      url: 'https://aws.amazon.com/certification/certified-solutions-architect-associate/',
    },
  });
  console.log(`✓ Created certification: ${certification.name}`);

  // Create 1 Sample Job for testing (future phases)
  console.log('\nCreating sample job listing...');
  const job = await prisma.job.create({
    data: {
      userId: user.id,
      title: 'Senior TypeScript Developer',
      company: 'Discovery Limited',
      location: 'Johannesburg, Gauteng, South Africa',
      url: 'https://www.linkedin.com/jobs/view/example-123',
      source: 'linkedin',
      description: `Discovery Limited, a leading South African financial services group, is seeking a Senior TypeScript Developer to join our Digital Innovation team in Johannesburg.

About the Role:
We are looking for an experienced full-stack developer with strong TypeScript skills to build next-generation health and insurance platforms. You will work in a collaborative Agile environment, contributing to microservices architecture and cloud-native applications.

Key Responsibilities:
• Design and develop scalable microservices using TypeScript, Node.js, and NestJS
• Build responsive web applications using React and Next.js
• Collaborate with cross-functional teams including product managers, designers, and QA engineers
• Mentor junior developers and participate in code reviews
• Contribute to technical architecture decisions and best practices
• Ensure applications meet performance, security, and accessibility standards

Required Skills & Experience:
• 3+ years of professional software development experience
• Strong proficiency in TypeScript and JavaScript (ES6+)
• Experience with React and modern frontend frameworks
• Solid understanding of Node.js and backend development
• Experience with PostgreSQL or other relational databases
• Familiarity with Agile methodologies and DevOps practices
• Excellent problem-solving and communication skills
• South African citizen or valid work permit

Preferred Qualifications:
• Experience with NestJS framework
• Knowledge of Docker and containerisation
• Experience with cloud platforms (AWS, Azure, or GCP)
• Familiarity with CI/CD pipelines and automated testing
• Previous experience in fintech or healthtech sectors

What We Offer:
• Competitive salary package
• Medical aid and retirement fund contributions
• Annual performance bonuses
• Professional development opportunities
• Hybrid work model (3 days office, 2 days remote)
• Diverse and inclusive workplace culture

BEE Compliance:
Discovery Limited is committed to transformation and employment equity. Preference will be given to candidates from designated groups (previously disadvantaged individuals) in line with our employment equity plan and BEE commitments.

Notice Period:
Please indicate your current notice period in your application. Immediate or 1-month notice periods preferred.

To Apply:
Submit your CV and a brief cover letter outlining your relevant experience and why you're interested in joining Discovery.`,
      requirements: [
        'TypeScript',
        'React',
        'Node.js',
        'PostgreSQL',
        '3+ years experience',
        'Agile methodology',
        'Problem-solving skills',
        'Communication skills',
      ],
    },
  });
  console.log(`✓ Created sample job: ${job.title} at ${job.company}`);

  // Summary
  console.log('\n📊 Seed Data Summary:');
  console.log(`   • Users: 1 (${user.email})`);
  console.log(`   • Master Profiles: 1`);
  console.log(`   • Work Experiences: ${experiences.length}`);
  console.log(`   • Skills: ${skills.length}`);
  console.log(`   • Projects: ${projects.length}`);
  console.log(`   • Education: 1`);
  console.log(`   • Certifications: 1`);
  console.log(`   • Sample Jobs: 1`);
  console.log('\n✅ Seed data complete!');
  console.log(
    '\nTest Account:\n   Email: test@maxedcv.com\n   Name: Sipho Ngwenya\n'
  );
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
