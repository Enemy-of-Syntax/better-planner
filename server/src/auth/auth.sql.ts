import { Injectable } from '@nestjs/common';
import { Prisma, user, file, USER_ROLE, INVITATION_STATUS } from '@prisma/client';
import { ChangeMMTime } from 'libs/UTCtime';
import { User } from 'src/@types/SqlReturnType';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidV4 } from 'uuid';
@Injectable()
export class QueryService {
    constructor(private readonly prisma: PrismaService) {}

    async findUserByEmail(email: string): Promise<User[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,
            public.users.email,
            public.users.password,
            public.users.status,
            public.users.role,
            public.users.image_id,
            public.files.name AS image_name,
            public.files.path AS image_path,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users.image_id=public.files.id
            WHERE public.users.email=${email}
            `,
        );
    }

    async findAllUsers(): Promise<User[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,
            public.users.email,
            public.users.password,
            public.users.status,
            public.users.role,
            public.users.image_id AS image_id,
            public.files.name AS image_name,
            public.files.path AS image_path,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users.image_id=public.files.id
            `,
        );
    }

    async findUserById(id: string): Promise<User[]> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
            SELECT 
            public.users.id,
            public.users.email,
            public.users.password,
            public.users.status,
            public.users.role,
            public.users.image_id AS image_id,
            public.files.name AS image_name,
            public.files.path AS image_path,
            public.users.created_at,
            public.users.updated_at
            FROM public.users
            LEFT JOIN public.files
            ON public.users.image_id=public.files.id
            WHERE public.users.id=${id}
            `,
        );
    }

    async insertNewUser({ id, email, imageId, name, password }): Promise<User | undefined> {
        const todayDate = await ChangeMMTime();
        await this.prisma
            .$executeRaw`INSERT INTO public.users ( id,email,name,password,image_id,created_at,updated_at) VALUES (${id},${email},${name},${password},${
            imageId && imageId
        },${todayDate},${todayDate})`;

        let userArr = await this.findUserByEmail(email);
        return userArr[0];
    }

    async insertPhoto({ name, path }) {
        const id: string = await uuidV4();
        const todayDate = await ChangeMMTime();
        await this.prisma.$executeRaw`INSERT INTO public.files
                (id,name,path,created_at,updated_at)
                VALUES(${id},${name},${path},${todayDate},${todayDate})`;

        let imageArr: file[] = await this.prisma.$queryRaw(
            Prisma.sql`SELECT * FROM public.files WHERE id=${id}`,
        );

        let findImageObj = imageArr[0];

        return { id: findImageObj?.id, name: findImageObj?.name, path: findImageObj?.path };
    }

    async updateUser({ id, email, imageId, name, password }): Promise<User | undefined> {
        const todayDate = await ChangeMMTime();
        await this.prisma.$executeRaw`UPDATE public.users 
                                SET email=${email},
                                    name=${name},
                                    password=${password},
                                    updated_at=${todayDate},
                                    image_id=${imageId && imageId}
                                WHERE id=${id}
                                    `;
        let updArr: User[] | undefined = await this.findUserById(id);
        return updArr[0];
    }

    async updateUserStatus(status: INVITATION_STATUS, email: string): Promise<User[]> {
        const todayDate = await ChangeMMTime();
        console.log(status, email);
        await this.prisma.$executeRaw`UPDATE public.users 
                                       SET status=${status},
                                          updated_at = ${todayDate}
                                       WHERE email=${email}

                                       `;
        return await this.findUserByEmail(email);
    }

    async updateUserRecoveryCode(code: number | null, email: string): Promise<number> {
        const todayDate = await ChangeMMTime();
        return await this.prisma.$executeRaw`UPDATE public.users
                                              SET recovery_code=${code && code},
                                                  code_valid_time=${todayDate}
                                              WHERE email=${email}
                                              `;
    }

    async updateUserRole(role: USER_ROLE, userId: string): Promise<User[]> {
        const todayDate = await ChangeMMTime();
        await this.prisma.$executeRaw`UPDATE public.users   
                                      SET role=${role},
                                          updated_at=${todayDate}
                                          WHERE public.users.id=${userId}
                                      `;
        return await this.findUserById(userId);
    }

    async updateUserPassword(email: string, password: string): Promise<User[]> {
        const todayDate = await ChangeMMTime();
        await this.prisma.$executeRaw`UPDATE public.users 
                                            SET password=${password},:Promise<User[]>
                                            updated_at = ${todayDate}
                                            WHERE email=${email}

        `;
        return await this.findUserByEmail(email);
    }

    async updateRefreshToken(id: string, token: string): Promise<number> {
        const todayDate = await ChangeMMTime();
        return await this.prisma.$executeRaw`UPDATE public.users
                                        SET refresh_token=${token},
                                         updated_at = ${todayDate}
                                        WHERE id=${id}`;
    }
}
