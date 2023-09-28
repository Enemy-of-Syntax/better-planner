import { HttpException, Injectable } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { MEMBER_STATUS, MEMBER_ROLE } from '@prisma/client';
import { memberQuery } from './member.sql';
import { error } from 'console';
import { Responser } from 'libs/Responser';
import { v4 as uuidV4 } from 'uuid';

@Injectable()
export class MemberService {
    constructor(private readonly memberQuery: memberQuery) {}
    async create(
        createMemberDto: CreateMemberDto,
        status: MEMBER_STATUS,
        role: MEMBER_ROLE,
        createdUserId: string,
    ) {
        try {
            const memberAlreadyExist: any = await this.memberQuery.findMemberByUserId(
                createMemberDto.userId,
            );
            console.log(memberAlreadyExist);
            if (memberAlreadyExist[0]) throw new Error('member already exist');
            const id = await uuidV4();

            const newMember = await this.memberQuery.createMember(
                id,
                createMemberDto,
                status,
                role,
                createdUserId,
            );
            if (!newMember) throw error;

            return Responser({
                statusCode: 200,
                message: 'successfully created new team',
                devMessage: 'successfully created new team',
                body: newMember,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to create new member ',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async findAll() {
        try {
            const allMembers: any = await this.memberQuery.getAllMembers();
            if (!allMembers) throw error;

            return Responser({
                statusCode: 200,
                message: 'Successfully fetched all members',
                devMessage: 'Successfully fetched all members',
                body: {
                    count: allMembers.length,
                    data: allMembers,
                },
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'failed to get all members',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async findOne(id: string) {
        try {
            const memberDetail = await this.memberQuery.getSingleMember(id);
            if (!memberDetail) throw error;

            return Responser({
                statusCode: 200,
                devMessage: 'successfully fetch member detail',
                message: 'successfully fetch member detail',
                body: memberDetail,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to fetch member detail',
                    devMessage: err.message || '',
                },
                404,
            );
        }
    }

    async update(
        id: string,
        updateMemberDto: UpdateMemberDto,
        status: MEMBER_STATUS,
        role: MEMBER_ROLE,
    ) {
        try {
            const updatedMember = await this.memberQuery.updateMember(
                id,
                updateMemberDto,
                status,
                role,
            );
            if (!updatedMember) throw error;

            return Responser({
                statusCode: 200,
                devMessage: 'successfully updated member',
                message: 'successfully updated member',
                body: updatedMember,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to update member',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }

    async remove(id: string) {
        try {
            const memberList: any = await this.memberQuery.getAllMembers();
            if (memberList.length === 0) throw new Error('member list empty');

            const removedMember: any = await this.memberQuery.deleteMember(id);
            return Responser({
                statusCode: 204,
                message: 'successfully removed member ',
                devMessage: 'successfully removed member',
                body: removedMember,
            });
        } catch (err: any) {
            throw new HttpException(
                {
                    message: 'Failed to delete new member',
                    devMessage: err.message || '',
                },
                400,
            );
        }
    }
}
