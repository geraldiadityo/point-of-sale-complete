import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { SatuanService } from "./satuan.service";
import { RoleGuard } from "src/common/role.guard";
import { Roles } from "src/common/role.decorator";
import { SatuanCreateDTO, SatuanResponse } from "./dto/satuan.model";
import { WebModel } from "src/model/web.model";

@UseGuards(RoleGuard)
@Controller('/api/satuan')
export class SatuanController {
    constructor(
        private satuanService: SatuanService
    ) {}
    
    @Roles('Admin')
    @Post('/create-satuan')
    @HttpCode(201)
    async create(
        @Body() request: SatuanCreateDTO
    ): Promise<WebModel<SatuanResponse>>{
        const result = await this.satuanService.create(request);

        return {
            data: result,
            message: `Satuan with name: ${result.nama_satuan} was successfully created`
        }
    }

    @Roles('Admin')
    @Put('/update-satuan/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: SatuanCreateDTO
    ): Promise<WebModel<SatuanResponse>> {
        const result = await this.satuanService.update(request, id);

        return {
            data: result,
            message: `Satuan was successfully updated`
        }
    }

    @Roles('Admin')
    @Get('/view')
    @HttpCode(200)
    async list(): Promise<WebModel<SatuanResponse[]>> {
        const result = await this.satuanService.getAll();

        return {
            data: result,
        }
    }

    @Roles('Admin')
    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<SatuanResponse>> {
        const result = await this.satuanService.satuanMustBeExists(id);

        return {
            data: result,
            message: 'found it'
        }
    }

    @Roles('Admin')
    @Delete('/delete-satuan/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>> {
        const result = await this.satuanService.remove(id);

        return {
            data: true,
            message: `Satuan with name: ${result.nama_satuan} was successfully deleted`
        }
    }
}