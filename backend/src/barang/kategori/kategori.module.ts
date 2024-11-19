import { Module } from "@nestjs/common";
import { KategoriService } from "./kategori.service";
import { KategoriRepository } from "./kategori-repo/kategori-repository";
import { KateoriController } from "./kategori.controller";

@Module({
    providers: [KategoriService, KategoriRepository],
    controllers: [KateoriController]
})
export class KategoriModule {}