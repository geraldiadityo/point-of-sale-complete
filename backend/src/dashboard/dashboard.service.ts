import { Injectable } from "@nestjs/common";
import { TransaksiService } from "src/barang/transaksi/transaksi.service";
import { DashboardResponse } from "./dto/dashboard.model";
import { TransaksiResponse } from "src/barang/transaksi/dto/transaksi.model";

@Injectable()
export class DashboardService {
    constructor(
        private transaksiService: TransaksiService,
    ) {}

    async getDataDashboard(): Promise<DashboardResponse> {
        // transaksi barang
        const dataTransaksi: TransaksiResponse[] = await this.transaksiService.listAllFinalLunasToday();
        let total = 0;
        // console.log(dataTransaksi);
        dataTransaksi.map((item) => {
            total += item.total_bayar;
        });

        const dataResponse = {
            transaksi: total
        }

        return dataResponse;
    }
}