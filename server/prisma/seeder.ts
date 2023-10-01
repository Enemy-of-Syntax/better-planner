import { PrismaClient, user } from '@prisma/client';
import * as argon from 'argon2';
const prisma = new PrismaClient();

const users = [
    {
        email: 'mohmohaung737@gmail.com',
        password: 'moh12345@',
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

const createUsers = async (user) => {
    return await prisma.user.createMany({
        data: {
            email: user.email,
            password: await argon.hash(user.password),
        },
    });
};

async function main() {
    console.log('start seeding...');
    console.log('creating users...');

    for (let i = 0; i < users.length; i++) {
        await createUsers(users[i]);
    }

    console.log('seeding finished');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
