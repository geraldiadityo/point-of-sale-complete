import { Module } from "@nestjs/common";
import { KeranjangRepository } from "./repository/keranjang-repository";
import { KeranjangService } from "./keranjang.service";
import { KeranjangController } from "./keranjang.controller";

@Module({
    providers: [KeranjangRepository, KeranjangService],
    controllers: [KeranjangController],
    exports: [KeranjangService],
})
export class KeranjangModule {}