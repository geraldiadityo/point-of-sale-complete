import { Module } from "@nestjs/common";
import { TransaksiRepository } from "./repository/transaksi-repository";
import { TransaksiService } from "./transaksi.service";
import { TransaksiController } from "./transaksi.controller";
import { BatchModule } from "../batch/batch.module";
import { KeranjangModule } from "../keranjang/keranjang.module";
import { StokModule } from "../stok/stok.module";

@Module({
    imports: [BatchModule, KeranjangModule, StokModule],
    providers: [TransaksiRepository, TransaksiService],
    controllers: [TransaksiController],
})
export class TransaksiModule {}