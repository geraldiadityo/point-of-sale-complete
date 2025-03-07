import { Controller, Get, HttpCode, Param, ParseIntPipe } from "@nestjs/common";
import { KeranjangService } from "./keranjang.service";
import { WebModel } from "src/model/web.model";
import { KeranjangResponse, KeranjangResponseEx } from "./dto/keranjang.model";

@Controller('/api/keranjang')
export class KeranjangController {
    constructor(
        private keranjangService: KeranjangService
    ) {}

    @Get('/view-by-transaksi/:transaksiId')
    @HttpCode(200)
    async listByTransaksi(
        @Param('transaksiId', ParseIntPipe) transaksiId: number
    ): Promise<WebModel<KeranjangResponseEx[]>> {
        const result = await this.keranjangService.listKeranjangByIdTransaksi(transaksiId);

        return {
            data: result,
            message: 'success'
        }
    }
}