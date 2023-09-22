import { Injectable } from '@nestjs/common';
import { Prisma, user, file } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class QueryService {
    constructor(private readonly prisma: PrismaService) {}

    async findUserByEmail(email: string): Promise<user[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,public.users.email,public.users.name AS user_name,
            public.users."imageId",
            public.files.name AS image_name,
            public.files.path,
            public.users.password,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users."imageId"=public.files.id
            WHERE public.users.email=${email}
            `,
        );
    }

    async findAllUsers(): Promise<user[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,public.users.email,public.users.name AS user_name,
            public.users."imageId",
            public.files.name AS image_name,
            public.files.path,
            public.users.password,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users."imageId"=public.files.id
            `,
        );
    }

    async findUserById(id: string): Promise<user> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,public.users.email,public.users.name AS user_name,
            public.users."imageId",
            public.files.name AS image_name,
            public.files.path,
            public.users.password,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users."imageId"=public.files.id
            WHERE public.users.id=${id}
            `,
        );
    }

    async insertNewUser({ id, email, imageId, name, password }) {
        const newDate = new Date();
        await this.prisma
            .$executeRaw`INSERT INTO public.users ( id,email,name,password,"imageId",created_at,updated_at) VALUES (${id},${email},${name},${password},${
            imageId && imageId
        },${newDate},${newDate})`;

        let userArr = await this.findUserByEmail(email);
        console.log(userArr);
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
        console.log('query', findImageObj);

        return { id: findImageObj?.id, name: findImageObj?.name, path: findImageObj?.path };
    }
}
