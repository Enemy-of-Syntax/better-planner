import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';
import { ChangeMMTime } from 'libs/UTCtime';
const prisma = new PrismaClient();

// ******************Types*******************
interface User {
    email: string;
    password: string;
}
interface Team {
    name: string;
    createdUserId: string;
}
interface Board {
    name: string;
    teamId: string;
    projectId: string;
    createdUserId: string;
}
interface Project {
    name: string;
    description: string;
    status: string;
    createdUserId: string;
}
// ******************************************

// ******************Arrays*******************

const usersArr: User[] = [
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
const teamsArr: Team[] = [];
const projectsArr: Project[] = [];
const boards: Board[] = [];

// *******************************************

// *****************Functions******************
const createUsers = async (user: User | undefined) => {
    return await prisma.user.createMany({
        data: {
            email: user?.email || '',
            password: await argon.hash(user?.password || ''),
            createdAt: await ChangeMMTime(),
            updatedAt: await ChangeMMTime(),
        },
        skipDuplicates: true,
    });
};

const createProjects = async (project: Project | undefined) => {
    return await prisma.project.createMany({
        data: {
            name: project?.name || '',
            description: project?.description || '',
            status: 'ACTIVE',
            createdUserId: project?.createdUserId || '',
            createdAt: await ChangeMMTime(),
            updatedAt: await ChangeMMTime(),
        },
        skipDuplicates: true,
    });
};

const createTeams = async (team: Team | undefined) => {
    return await prisma.team.createMany({
        data: {
            name: team?.name || '',
            createdUserId: team?.createdUserId || '',
            createdAt: await ChangeMMTime(),
            updatedAt: await ChangeMMTime(),
        },
        skipDuplicates: true,
    });
};

const insertTeamArr = async (id: string) => {
    const sampleArr: Team[] = [
        {
            name: 'Backend Team',
            createdUserId: id,
        },
        {
            name: 'Mobile Team',
            createdUserId: id,
        },
        {
            name: 'Frontend Team',
            createdUserId: id,
        },
    ];

    sampleArr.map((item) => {
        return teamsArr.push(item);
    });
};

const insertProjectArr = async (id: string) => {
    const sampleArr: Project[] = [
        {
            name: 'The Beast',
            description: 'This is the beast project',
            status: 'ACTIVE',
            createdUserId: id,
        },
        {
            name: 'Alan Sayar',
            description: 'This is shal project',
            status: 'ACTIVE',
            createdUserId: id,
        },
        {
            name: 'Pocket Nicotine',
            description: 'This is pocket nicotine',
            status: 'ACTIVE',
            createdUserId: id,
        },
    ];

    sampleArr.map((item) => {
        return projectsArr.push(item);
    });
};

const insertBoardsArr = async (teamId: string, projectId: string, userId: string) => {
    const sampleArr: Board[] = [
        {
            name: 'Backend Board',
            teamId,
            projectId,
            createdUserId: userId,
        },
        {
            name: 'Mobile Board',
            teamId,
            projectId,
            createdUserId: userId,
        },
        {
            name: 'Frontend Board',
            teamId,
            projectId,
            createdUserId: userId,
        },
    ];

    sampleArr.map((item) => {
        return boards.push(item);
    });
};
// ********************************************

// Main Function
async function main() {
    console.log('start seeding...');
    console.log('creating users...');

    for (let i = 0; i < usersArr.length; i++) {
        await createUsers(usersArr[i]);
    }

    const findusersArr = await prisma.user.findMany();
    const userId = findusersArr[0]?.id;

    await insertProjectArr((userId && userId) || '');

    console.log('creating projects ...');
    for (let i = 0; i < projectsArr.length; i++) {
        await createProjects(projectsArr[i]);
    }

    await insertTeamArr((userId && userId) || '');

    console.log('creating teams...');
    for (let i = 0; i < teamsArr.length; i++) {
        await createTeams(teamsArr[i]);
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
