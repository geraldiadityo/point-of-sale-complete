import { Module } from "@nestjs/common";
import { TransaksiModule } from "src/barang/transaksi/transaksi.module";
import { DashboardService } from "./dashboard.service";
import { DashboardController } from "./dashboard.controller";

@Module({
    imports: [
        TransaksiModule
    ],
    providers: [DashboardService],
    controllers: [DashboardController]
})
export class DashboardModule {}