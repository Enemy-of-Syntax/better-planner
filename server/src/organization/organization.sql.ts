import { Injectable } from '@nestjs/common';
import { ORGANIZATION_STATUS, Prisma, organization } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateOrganizationDto, organizationDto } from './dto/organization.dto';

@Injectable()
export class organizationQuery {
    constructor(private readonly prisma: PrismaService) {}

    async findOrganizationById(id: string): Promise<organization[] | []> {
        return await this.prisma.$queryRaw(
            Prisma.sql`
                  SELECT * FROM public.organizations
                  WHERE id=${id}
                  `,
        );
    }

    async findAllOrganizations(): Promise<any> {
        try {
            return await this.prisma.$queryRaw(
                Prisma.sql`
                    SELECT * FROM public.organizations
          `,
            );
        } catch (err) {
            console.log(err);
        }
    }

    async insertNewOrganization(
        uuid: string,
        dto: organizationDto,
        status: ORGANIZATION_STATUS,
    ): Promise<any> {
        const newDate = new Date();
        await this.prisma.$executeRaw`INSERT INTO public.organizations
                    (id,name,status,created_at,updated_at) 
                     VALUES(${uuid},${dto.name},${status},${newDate},${newDate}) `;

        return await this.findOrganizationById(uuid);
    }

    async updateOrganization(id: string, dto: UpdateOrganizationDto, status: ORGANIZATION_STATUS) {
        try {
            if (dto.name !== '' || undefined || null || false) {
                const newDate = new Date();
                await this.prisma.$executeRaw`UPDATE public.organizations 
                                                            SET name=${dto.name},
                                                                status=${status},
                                                                updated_at=${newDate}
                                                            WHERE id=${id}`;
                return await this.findOrganizationById(id);
            }
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async deleteOrganization(id: string) {
        return await this.prisma.$executeRaw`DELETE FROM public.organizations WHERE id=${id}`;
    }
}
