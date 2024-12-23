import { PrismaClient, Gender, NameOrigin } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // 创建管理员用户
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        email: 'admin@example.com',
        name: 'Administrator',
        password: 'admin123', // 注意：实际生产环境中应该使用加密密码
      },
    });

    // 创建测试用户
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'test123', // 注意：实际生产环境中应该使用加密密码
      },
    });

    // 创建示例婴儿名字
    const babyName1 = await prisma.babyName.create({
      data: {
        name: '浩然',
        gender: Gender.MALE,
        meaning: '形容正大光明，宽广无边的样子，寓意人品德高尚，气度开阔',
        origin: NameOrigin.CLASSICAL_LITERATURE,
        popularity: 85,
        lucky: true,
        strokes: 10,
        userId: admin.id,
      },
    });

    const babyName2 = await prisma.babyName.create({
      data: {
        name: '诗雨',
        gender: Gender.FEMALE,
        meaning: '如诗如画的雨，带有诗意的美好',
        origin: NameOrigin.MODERN_LITERATURE,
        popularity: 75,
        lucky: true,
        strokes: 13,
        userId: admin.id,
      },
    });

    const babyName3 = await prisma.babyName.create({
      data: {
        name: '天乐',
        gender: Gender.UNISEX,
        meaning: '快乐来自天堂，寓意幸福快乐的人生',
        origin: NameOrigin.BUDDHISM,
        popularity: 80,
        lucky: true,
        strokes: 6,
        userId: testUser.id,
      },
    });

    console.log('Seed data created successfully');
    console.log('Admin user:', admin);
    console.log('Test user:', testUser);
    console.log('Baby names created:', {
      babyName1,
      babyName2,
      babyName3,
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Seed error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 