import { Injectable } from '@nestjs/common';
import { Prisma, user } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QueryServie {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<user> {
    return this.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM public.users WHERE email=${email}`,
    );
  }

  async findUserById(id: string): Promise<user> {
    return this.prisma.$queryRaw(
      Prisma.sql`
      SELECT * FROM public.users WHERE id=${id}
      `,
    );
  }

  async insertNewUser({
    id,
    email,
    name,
    password,
    organizationId,
  }): Promise<user> {
    const newDate = new Date();
    await this.prisma
      .$executeRaw`INSERT INTO public.users ( id,email,name,password,"organizationId","createdAt","updatedAt") VALUES (${id},${email},${name},${password},${organizationId},${newDate},${newDate})`;

    return this.findUserByEmail(email);
  }
}
