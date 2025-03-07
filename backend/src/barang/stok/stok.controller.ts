import { Body, Controller, Get, HttpCode, ParseEnumPipe, ParseIntPipe, Post, Query } from "@nestjs/common";
import { StokService } from "./stok.service";
import { ValidationService } from "src/common/validation.service";
import { StokCreateDTO, StokResponse } from "./dto/stok.model";
import { WebModel } from "src/model/web.model";
import { StokValidation } from "./stok.validation";
import { TypeStok } from "@prisma/client";

@Controller('/api/stok')
export class StokController {
    constructor(
        private stokService: StokService,
        private validationService: ValidationService
    ) {}


    @Post('/create-stok')
    @HttpCode(201)
    async createStok(
        @Body() request: StokCreateDTO
    ): Promise<WebModel<StokResponse>> {
        const requestCreate = this.validationService.validate(StokValidation.CREATE, request);

        const result = await this.stokService.createStok(requestCreate);

        return {
            data: result,
            message: `stok was created successfully`
        }
    }

    @Get('/view')
    @HttpCode(200)
    async listByType(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('type', new ParseEnumPipe(TypeStok)) type: TypeStok
    ): Promise<WebModel<StokResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.stokService.listByType(pageSize, skip, type);
        const totalItem = await this.stokService.countByStok(type);
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            message: 'success',
            totalItem: totalItem,
            totalPages: totalPage,
            currentPage: page,
        }
    }
}