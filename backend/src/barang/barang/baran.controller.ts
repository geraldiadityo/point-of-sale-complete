import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { BarangService } from "./barang.service";
import { BarangCreateDTO, BarangResponse } from "./dto/barang.model";
import { WebModel } from "src/model/web.model";
import { Throttle } from "@nestjs/throttler";

@Controller('/api/barang')
export class BarangController {
    constructor(
        private barangService: BarangService
    ) {}

    @Post('/create-barang')
    @HttpCode(201)
    async create(
        @Body() request: BarangCreateDTO
    ): Promise<WebModel<BarangResponse>> {
        const result = await this.barangService.barangCreate(request);

        return {
            data: result,
            message: `Barang with name: ${result.nama_barang} was created successfully`
        }
    }

    @Put('/update-barang/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: BarangCreateDTO
    ): Promise<WebModel<BarangResponse>> {
        const result = await this.barangService.barangUpdate(id, request);

        return {
            data: result,
            message: `barang was updated successfully`
        }
    }

    @Throttle({ default: { limit: 3, ttl: 5000 } })
    @Get('/search-barang')
    @HttpCode(200)
    async search(
        @Query('keyword') keyword: string
    ): Promise<WebModel<BarangResponse[]>> {
        const result = await this.barangService.search(keyword);

        return {
            data: result,
            message: `found it search result`
        }
    }

    @Get('/view')
    @HttpCode(200)
    async list(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<BarangResponse[]>>{
        const skip = (page - 1) * pageSize;
        const result = await this.barangService.list(pageSize, skip);
        const totalItem = await this.barangService.countBarang();
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            currentPage: page,
            totalItem: totalItem,
            totalPages: totalPage
        }
    }

    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<BarangResponse>> {
        const result = await this.barangService.barangMustBeExists(id);

        return {
            data: result,
            message: `found it`
        }
    }

    @Delete('/delete-barang/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>> {
        const result = await this.barangService.barangDelete(id);

        return {
            data: true,
            message: `barang with name: ${result.nama_barang} was deleted successfully`
        }
    }
}