import { Prisma, PrismaClient, user } from '@prisma/client';
const prisma = new PrismaClient();

const users = [
    {
        email: 'mohmohaung737@gmail.com',
        password: 'moh123',
    },
    {
        email: 'kyawna2265@gmail.com',
        password: 'paing12345@',
    },
    {
        email: 'phyothukha2193@gmail.com',
        password: 'phyo12345@',
    },
];

const createUsers = async (usersArr) => {
    await prisma.user.createMany(usersArr);
};
