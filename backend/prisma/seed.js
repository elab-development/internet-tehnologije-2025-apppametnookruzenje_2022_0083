const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  const parentRole = await prisma.role.upsert({
    where: { name: "PARENT" },
    update: {},
    create: { name: "PARENT" },
  });

  const childRole = await prisma.role.upsert({
    where: { name: "CHILD" },
    update: {},
    create: { name: "CHILD" },
  });


  await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      password: "admin123",
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "parent@test.com" },
    update: {},
    create: {
      email: "parent@test.com",
      password: "parent123",
      roleId: parentRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "child@test.com" },
    update: {},
    create: {
      email: "child@test.com",
      password: "child123",
      roleId: childRole.id,
    },
  });

 
  let livingRoom = await prisma.room.findFirst({
    where: { name: "Dnevna soba" },
  });
  if (!livingRoom) {
    livingRoom = await prisma.room.create({
      data: { name: "Dnevna soba" },
    });
  }

  let kitchen = await prisma.room.findFirst({
    where: { name: "Kuhinja" },
  });
  if (!kitchen) {
    kitchen = await prisma.room.create({
      data: { name: "Kuhinja" },
    });
  }

 
  await prisma.device.upsert({
    where: { roomId_name: { roomId: livingRoom.id, name: "Pametno svetlo" } },
    update: {},
    create: {
      name: "Pametno svetlo",
      roomId: livingRoom.id,
      isActive: true,
      serialNumber: "SL-001",
    },
  });

  await prisma.device.upsert({
    where: { roomId_name: { roomId: livingRoom.id, name: "Klima uređaj" } },
    update: {},
    create: {
      name: "Klima uređaj",
      roomId: livingRoom.id,
      isActive: false,
      serialNumber: "AC-001",
    },
  });

  await prisma.device.upsert({
    where: { roomId_name: { roomId: kitchen.id, name: "Pametna brava" } },
    update: {},
    create: {
      name: "Pametna brava",
      roomId: kitchen.id,
      isActive: true,
      serialNumber: "LOCK-001",
    },
  });

  console.log(" Seed podaci su uspešno ubačeni");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

