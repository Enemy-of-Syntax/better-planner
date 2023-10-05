import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoardService } from './board.service';
import { boardDto } from './dto/board.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { IauthRequest } from 'src/@types/authRequest';

@Controller('board')
@ApiTags('board')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BoardController {
    constructor(private readonly boardService: BoardService) {}
    @ApiResponse({ status: 200, description: 'successfully fetched boards list' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 401, description: 'bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('all')
    GetAll() {
        return this.boardService.getAllBoards();
    }

    @ApiResponse({
        status: 200,
        description: 'successfully fetch board detail',
    })
    @ApiResponse({
        status: 404,
        description: 'not found',
    })
    @ApiResponse({
        status: 401,
        description: 'bad request',
    })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Get('detail/:id')
    getDetail(@Param('id') id: string) {
        return this.boardService.getDetail(id);
    }

    @ApiResponse({ status: 201, description: 'successfully created new board' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Post('create')
    CreateOrganization(@Body() dto: boardDto, @Request() req: IauthRequest) {
        return this.boardService.createBoard(dto, req.user.id);
    }

    @ApiResponse({ status: 201, description: 'successfully updated organizations' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Put('update/:id')
    UpdatedOrganization(@Param('id') id: string, @Body() dto: boardDto): Promise<any> {
        return this.boardService.updateBoard(id, dto);
    }

    @ApiResponse({ status: 200, description: 'successfully deleted organizations' })
    @ApiResponse({ status: 404, description: 'not found' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 500, description: 'internal server error' })
    @Delete('delete/:id')
    RemoveOrganization(@Param('id') id: string): Promise<any> {
        return this.boardService.deleteBoard(id);
    }
}
