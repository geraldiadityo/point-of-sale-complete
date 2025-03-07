import { Module } from "@nestjs/common";
import { BatchRepository } from "./repository/batch-repository";
import { BatchService } from "./batch.service";
import { BarangModule } from "../barang/barang.module";
import { BatchController } from "./batch.controller";
import { StokModule } from "../stok/stok.module";

@Module({
    imports: [BarangModule, StokModule],
    controllers: [BatchController],
    providers: [BatchRepository, BatchService],
    exports: [BatchService]
})
export class BatchModule {}