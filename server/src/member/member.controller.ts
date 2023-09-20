import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from '@nestjs/common';
import { MemberService } from './member.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { UpdateMemberDto } from './dto/update-member.dto';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MEMBER_ROLE, MEMBER_STATUS } from '@prisma/client';

@Controller('member')
@ApiTags('member')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @ApiResponse({ status: 201, description: 'successfully created new team' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiQuery({ name: 'status', enum: MEMBER_STATUS })
    @ApiQuery({ name: 'role', enum: MEMBER_ROLE })
    @Post('create')
    create(
        @Body() createMemberDto: CreateMemberDto,
        @Query('status') status: MEMBER_STATUS = MEMBER_STATUS.ACTIVE,
        @Query('role') role: MEMBER_ROLE = MEMBER_ROLE.ADMIN,
    ) {
        return this.memberService.create(createMemberDto, status, role);
    }

    @ApiResponse({ status: 200, description: 'successfully fetched all teams' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('getAll')
    findAll() {
        return this.memberService.findAll();
    }

    @ApiResponse({ status: 200, description: 'successfully fetched team ' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('detail/:id')
    findOne(@Param('id') id: string) {
        return this.memberService.findOne(id);
    }

    @ApiResponse({ status: 201, description: 'successfully created new team' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @ApiQuery({ name: 'status', enum: MEMBER_STATUS })
    @ApiQuery({ name: 'role', enum: MEMBER_ROLE })
    @Put('update/:id')
    update(
        @Param('id') id: string,
        @Body() updateMemberDto: UpdateMemberDto,
        @Query('status') status: MEMBER_STATUS = MEMBER_STATUS.ACTIVE,
        @Query('role') role: MEMBER_ROLE = MEMBER_ROLE.MEMBER,
    ) {
        return this.memberService.update(id, updateMemberDto, status, role);
    }

    @ApiResponse({ status: 201, description: 'successfully created new team' })
    @ApiResponse({ status: 400, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Delete('delete/:id')
    remove(@Param('id') id: string) {
        return this.memberService.remove(id);
    }
}