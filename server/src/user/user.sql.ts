import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QueryServie {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.$queryRaw(
      Prisma.sql`SELECT * FROM public.users WHERE email = $ {email}`,
    );
  }

  async insertNewUser({ id, email, name, password, organizationId }) {
    const newDate = new Date();
    return await this.prisma
      .$executeRaw`INSERT INTO public.users ( id,email,name,password,"organizationId","createdAt","updatedAt") VALUES (${id},${email},${name},${password},${organizationId},${newDate},${newDate})`;
  }
}
