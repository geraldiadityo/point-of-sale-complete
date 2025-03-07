import { Controller, Get, HttpCode, Param, ParseIntPipe } from "@nestjs/common";
import { BatchService } from "./batch.service";
import { WebModel } from "src/model/web.model";
import { BatchBarangResponse } from "./dto/batch.model";

@Controller('/api/batch')
export class BatchController {
    constructor(
        private batchService: BatchService
    ) {}

    @Get('/view/:idBarang')
    @HttpCode(200)
    async listByIdBarang(
        @Param('idBarang', ParseIntPipe) idBarang: number
    ): Promise<WebModel<BatchBarangResponse[]>> {
        const result = await this.batchService.listBatchByBarang(idBarang);

        return {
            data: result,
            message: `success`
        }
    }
}