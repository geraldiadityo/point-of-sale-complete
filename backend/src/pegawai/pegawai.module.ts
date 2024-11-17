import { Module } from "@nestjs/common";
import { PegawaiService } from "./pegawai.service";
import { PegawaiRepository } from "./pegawai-repository/pegawai-repository";
import { PegawaiController } from "./pegawai.controller";

@Module({
    providers: [PegawaiService, PegawaiRepository],
    controllers: [PegawaiController],
    exports: [PegawaiService],
})
export class PegawaiModule {}