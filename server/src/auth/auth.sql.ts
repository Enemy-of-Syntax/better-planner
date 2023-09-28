import { Injectable } from '@nestjs/common';
import { Prisma, user, file, USER_ROLE, INVITATION_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class QueryService {
    constructor(private readonly prisma: PrismaService) {}

    async findUserByEmail(email: string): Promise<user[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,
            public.users.email,
            public.users.status,
            public.users.name AS user_name,
            public.users.role,
            public.users.image_id,
            public.files.name AS image_name,
            public.files.path,
            public.users.password,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users.image_id=public.files.id
            WHERE public.users.email=${email}
            `,
        );
    }

    async findAllUsers(): Promise<user[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,
            public.users.email,
            public.users.status,
            public.users.name AS user_name,
            public.users.role,
            public.users.image_id,
            public.files.name AS image_name,
            public.files.path,
            public.users.password,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users.image_id=public.files.id
            `,
        );
    }

    async findUserById(id: string): Promise<user[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,
            public.users.email,
            public.users.status,
            public.users.name AS user_name,
            public.users.role,
            public.users.image_id,
            public.files.name AS image_name,
            public.files.path,
            public.users.password,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users.image_id=public.files.id
            WHERE public.users.id=${id}
            `,
        );
    }

    async insertNewUser({ id, email, imageId, name, password }) {
        const newDate = new Date();
        await this.prisma
            .$executeRaw`INSERT INTO public.users ( id,email,name,password,image_id,created_at,updated_at) VALUES (${id},${email},${name},${password},${
            imageId && imageId
        },${newDate},${newDate})`;

        let userArr = await this.findUserByEmail(email);
        return userArr[0];
    }

    async insertPhoto({ name, path }) {
        const id: string = await uuidV4();
        await this.prisma.$executeRaw`INSERT INTO public.files
                (id,name,path,created_at,updated_at)
                VALUES(${id},${name},${path},${new Date()},${new Date()})`;

        let imageArr: file[] = await this.prisma.$queryRaw(
            Prisma.sql`SELECT * FROM public.files WHERE id=${id}`,
        );

        let findImageObj = imageArr[0];

        return { id: findImageObj?.id, name: findImageObj?.name, path: findImageObj?.path };
    }

    async updateUser({ id, email, imageId, name, password }) {
        await this.prisma.$executeRaw`UPDATE public.users 
                                SET email=${email},
                                    name=${name},
                                    password=${password},
                                    updated_at=${new Date()},
                                    image_id=${imageId && imageId}
                                WHERE id=${id}
                                    `;
        let updArr: user[] | undefined = await this.findUserById(id);
        return updArr[0];
    }

    async updateUserStatus(status: INVITATION_STATUS, email: string) {
        console.log(status, email);
        await this.prisma.$executeRaw`UPDATE public.users 
                                       SET status=${status}
                                       WHERE email=${email}
                                       `;
        return await this.findUserByEmail(email);
    }

    async updateUserRole(userId: string) {
        return await this.prisma.$executeRaw`UPDATE public.users   
                                      SET role=${USER_ROLE.ADMIN},
                                          updated_at=${new Date()}
                                          WHERE public.users.id=${userId}
                                      `;
    }
}
