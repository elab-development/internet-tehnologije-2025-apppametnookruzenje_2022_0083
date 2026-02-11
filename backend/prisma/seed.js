const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

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


  const adminHash = await bcrypt.hash("sara", 10);
  const parentHash = await bcrypt.hash("mina", 10);
  const childHash = await bcrypt.hash("dete", 10);

 
  await prisma.user.upsert({
    where: { email: "sara@gmail.com" },
    update: {
      roleId: adminRole.id,
      password: adminHash, 
    },
    create: {
      email: "sara@gmail.com",
      password: adminHash,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "mina@gmail.com" },
    update: {
      roleId: parentRole.id,
      password: parentHash,
    },
    create: {
      email: "mina@gmail.com",
      password: parentHash,
      roleId: parentRole.id,
    },
  });

  await prisma.user.upsert({
    where: { email: "dete@gmail.com" },
    update: {
      roleId: childRole.id,
      password: childHash,
    },
    create: {
      email: "dete@gmail.com",
      password: childHash,
      roleId: childRole.id,
    },
  });


  let livingRoom = await prisma.room.findFirst({ where: { name: "Dnevna soba" } });
  if (!livingRoom) {
    livingRoom = await prisma.room.create({ data: { name: "Dnevna soba" } });
  }

  let kitchen = await prisma.room.findFirst({ where: { name: "Kuhinja" } });
  if (!kitchen) {
    kitchen = await prisma.room.create({ data: { name: "Kuhinja" } });
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

  console.log("Seed podaci su uspešno ubačeni.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

