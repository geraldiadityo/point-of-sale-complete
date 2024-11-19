import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { KategoriService } from "./kategori.service";
import { RoleGuard } from "src/common/role.guard";
import { Roles } from "src/common/role.decorator";
import { KategoriCreateDTO, KategoriResponse } from "./dto/kategori.mode";
import { WebModel } from "src/model/web.model";

@UseGuards(RoleGuard)
@Controller('/api/kategori')
export class KateoriController {
    constructor(
        private kategoriService: KategoriService
    ) {}

    @Roles('Admin')
    @Post('/create-kategori')
    @HttpCode(201)
    async create(
        @Body() request: KategoriCreateDTO
    ): Promise<WebModel<KategoriResponse>>{
        const result = await this.kategoriService.create(request);

        return {
            data: result,
            message: `kategori with name: ${request.nama_kategori} was successfully created`
        }
    }

    @Roles('Admin')
    @Put('/update-kategori/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: KategoriCreateDTO
    ): Promise<WebModel<KategoriResponse>> {
        const result = await this.kategoriService.update(id, request);

        return {
            data: result,
            message: `update kategori success`
        }


    }

    @Roles('Admin')
    @Get('/view')
    @HttpCode(200)
    async list(): Promise<WebModel<KategoriResponse[]>> {
        const result = await this.kategoriService.list();

        return {
            data: result
        }
    }

    @Roles('Admin')
    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<KategoriResponse>>{
        const result = await this.kategoriService.kategoriMustExists(id);

        return {
            data: result,
            message: `found it`
        }
    }

    @Roles('Admin')
    @Delete('/delete-kategori/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id:number
    ): Promise<WebModel<boolean>> {
        const result = await this.kategoriService.remove(id);

        return {
            data: true,
            message: `kategori with name: ${result.nama_kategori} was successfully deleted`
        }
    }
}