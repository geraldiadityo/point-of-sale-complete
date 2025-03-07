import { Module } from "@nestjs/common";
import { BarangService } from "./barang.service";
import { BarangRepository } from "./barang-repo/repository";
import { BarangController } from "./baran.controller";
import { KategoriModule } from "../kategori/kategori.module";
import { SatuanModule } from "../satuan/satuan.module";

@Module({
    imports: [KategoriModule, SatuanModule],
    providers: [BarangService, BarangRepository],
    controllers: [BarangController],
    exports: [BarangService]
})
export class BarangModule {}