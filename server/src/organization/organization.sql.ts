import { Injectable } from '@nestjs/common';
import { Prisma, organization } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class organizationQuery {
  constructor(private readonly prisma: PrismaService) {}

  async findOrganizationById(id: string): Promise<organization> {
    return await this.prisma.$queryRaw(
      Prisma.sql`
                  SELECT * FROM public.organizations
                  WHERE id=${id}
                  `,
    );
  }
}
