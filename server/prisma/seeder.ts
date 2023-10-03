import { PrismaClient, team, user } from '@prisma/client';
import * as argon from 'argon2';
const prisma = new PrismaClient();

interface User {
    email: string;
    password: string;
}
interface Team {
    name: string;
    createdUserId: string;
}

const users: User[] = [
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
    {
        email: 'naing123@gmail.com',
        password: 'naing123',
    },
];

const teams: Team[] = [
    {
        name: 'Backend Team',
        createdUserId: '8d866faf-3d01-4c58-810a-a7e7b6db832e',
    },
    {
        name: 'Mobile Team',
        createdUserId: '8d866faf-3d01-4c58-810a-a7e7b6db832e',
    },
    {
        name: 'Frontend Team',
        createdUserId: '8d866faf-3d01-4c58-810a-a7e7b6db832e',
    },
];

const createUsers = async (user: User | undefined) => {
    return await prisma.user.createMany({
        data: {
            email: user?.email || '',
            password: await argon.hash(user?.password || ''),
        },
        skipDuplicates: true,
    });
};

const createTeams = async (team: Team | undefined) => {
    return await prisma.team.createMany({
        data: {
            name: team?.name || '',
            createdUserId: team?.createdUserId || '',
        },
        skipDuplicates: true,
    });
};

async function main() {
    console.log('start seeding...');
    console.log('creating users...');

    for (let i = 0; i < users.length; i++) {
        await createUsers(users[i]);
    }

    console.log('creating teams...');
    for (let i = 0; i < teams.length; i++) {
        await createTeams(teams[i]);
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
