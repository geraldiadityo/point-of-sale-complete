import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query } from "@nestjs/common";
import { SupplierService } from "./supplier.service";
import { SupplierCreateDTO, SupplierResponse } from "./dto/supplier.model";
import { WebModel } from "src/model/web.model";

@Controller('/api/supplier')
export class SupplierContoller {
    constructor(
        private supplierService: SupplierService
    ) {}

    @Post('/create-supplier')
    @HttpCode(201)
    async create(
        @Body() request: SupplierCreateDTO
    ): Promise<WebModel<SupplierResponse>> {
        const result = await this.supplierService.create(request);

        return {
            data: result,
            message: `supplier with name: ${result.nama_supplier} was created successfully`
        }
    }

    @Put('/update-supplier/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: SupplierResponse
    ): Promise<WebModel<SupplierResponse>> {
        const result = await this.supplierService.update(id, request);

        return {
            data: result,
            message: `supplier was updated successfully`
        }
    }

    @Delete('/delete-supplier/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>> {
        const result = await this.supplierService.remove(id);

        return {
            data: true,
            message: `supplier with name: ${result.nama_supplier} was deleted successfully`
        }
    }

    @Get('/view')
    @HttpCode(200)
    async list(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<SupplierResponse[]>> {
        const skip: number = (page - 1) * pageSize;
        const result = await this.supplierService.list(pageSize, skip);
        const totalItem = await this.supplierService.countall();
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            totalPages: totalPage,
            totalItem: totalItem,
            currentPage: page
        }
    }

    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<SupplierResponse>> {
        const result = await this.supplierService.supplierMustBeExists(id);

        return {
            data: result,
            message: 'found it'
        }
    }

    @Get('/search-supplier')
    @HttpCode(200)
    async search(
        @Query('keyword') keyword: string
    ): Promise<WebModel<SupplierResponse[]>> {
        const result = await this.supplierService.search(keyword);

        return {
            data: result,
            message: `search result found!`
        }
    }
}