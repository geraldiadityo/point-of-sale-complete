import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from "@nestjs/common";
import { PegawaiService } from "./pegawai.service";
import { PegawaiRequestDTO, PegawaiResponse } from "./dto/pegawai.model";
import { WebModel } from "src/model/web.model";
import { RoleGuard } from "src/common/role.guard";
import { Roles } from "src/common/role.decorator";

@UseGuards(RoleGuard)
@Controller('/api/pegawai')
export class PegawaiController {
    constructor(
        private pegawaiService: PegawaiService
    ) {}

    @Roles('Admin')
    @Post('/create-pegawai')
    @HttpCode(201)
    async createPegawai(
        @Body() request: PegawaiRequestDTO
    ): Promise<WebModel<PegawaiResponse>> {
        const result = await this.pegawaiService.create(request);
        
        return {
            data: result,
            message: `create pegawai with name: ${request.nama_lengkap} was successfully`
        }
    }

    @Roles('Admin')
    @Put('/update-pegawai/:id')
    @HttpCode(200)
    async updatePegawai(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: PegawaiRequestDTO
    ): Promise<WebModel<PegawaiResponse>> {
        const result = await this.pegawaiService.update(id, request);

        return {
            data: result,
            message: `update pegawai was successfully`
        }
    }

    @Roles('Admin')
    @Get('/view')
    @HttpCode(200)
    async list(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<PegawaiResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.pegawaiService.list(skip, pageSize);
        const totalItem: number = await this.pegawaiService.countAllPegawai();
        const totalPage: number = Math.ceil(totalItem/pageSize);


        return {
            data: result,
            totalPages: totalPage,
            currentPage: page,
            totalItem: totalItem
        }
    }

    @Roles('Admin')
    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<PegawaiResponse>> {
        const result = await this.pegawaiService.get(id);

        return {
            data: result,
            message: 'found it'
        }
    }

    @Roles('Admin')
    @Get('/search-pegawai')
    @HttpCode(200)
    async search(
        @Query('keyword') keyword: string
    ): Promise<WebModel<PegawaiResponse[]>> {
        const result = await this.pegawaiService.search(keyword);

        return {
            data: result,
            message: 'found it'
        }
    }

    @Roles('Admin')
    @Delete('/delete-pegawai/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>> {
        const result = await this.pegawaiService.remove(id)
        
        return {
            data: true,
            message: `delete pegawai with name: ${result.nama_lengkap} was successfully`
        }
    }
}