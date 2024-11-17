import { Module } from "@nestjs/common";
import { PenggunaService } from "./pengguna.service";
import { PenggunaRepository } from "./pengguna-repository/pengguna-repository";
import { PenggunaController } from "./pengguna.controller";
import { PegawaiModule } from "src/pegawai/pegawai.module";
import { RoleModule } from "src/role/role.module";

@Module({
    imports: [PegawaiModule, RoleModule],
    providers: [PenggunaService, PenggunaRepository],
    controllers: [PenggunaController],
    exports: [PenggunaService, PenggunaRepository],
})
export class PenggunaModule {}