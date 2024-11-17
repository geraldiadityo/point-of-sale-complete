import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { PenggunaService } from "./pengguna.service";
import { PenggunaCreateRequest, PenggunaResponse } from "./dto/pengguna.model";
import { WebModel } from "src/model/web.model";
import { Roles } from "src/common/role.decorator";
import { RoleGuard } from "src/common/role.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

// @UseGuards(JwtAuthGuard)
@UseGuards(RoleGuard)
@Controller('/api/pengguna')
export class PenggunaController {
    constructor(
        private penggunaService: PenggunaService
    ) {}

    @Roles('Admin')
    @Post('/create-pengguna')
    @HttpCode(201)
    async create(
        @Body() request: PenggunaCreateRequest
    ): Promise<WebModel<PenggunaResponse>> {
        const result = await this.penggunaService.create(request);

        return {
            data: result,
            message: 'create pengguna was successfully'
        }
    }
    @Roles('Admin')
    @Get('/view')
    @HttpCode(200)
    async list(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<PenggunaResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.penggunaService.list(skip, pageSize);
        const totalItem = await this.penggunaService.countAll();
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            totalPages: totalPage,
            currentPage: page,
            totalItem: totalItem
        }
    }

    @Roles('Admin')
    @Get('/view/:username')
    @HttpCode(200)
    async get(
        @Param('username') username: string
    ): Promise<WebModel<PenggunaResponse>> {
        const result = await this.penggunaService.get(username);
        
        return {
            data: result,
            message: 'found it'
        }
    }

    @Roles('Admin')
    @Get('/search')
    @HttpCode(200)
    async search(
        @Query('keyword') keyword: string
    ): Promise<WebModel<PenggunaResponse[]>> {
        const result = await this.penggunaService.search(keyword);

        return {
            data: result,
            message: `search result found it`
        }
    }

    @Roles('Admin')
    @Delete('/delete-pengguna/:username')
    @HttpCode(200)
    async remove(
        @Param('username') username: string
    ): Promise<WebModel<boolean>> {
        const result = await this.penggunaService.remove(username);

        return {
            data: true,
            message: `Pengguna with username: ${result.username} was deleted successfully`
        }
    }
}