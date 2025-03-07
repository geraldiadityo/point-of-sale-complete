import { Module } from "@nestjs/common";
import { StokRepository } from "./repository/stok-repository";
import { StokService } from "./stok.service";
import { StokController } from "./stok.controller";

@Module({
    providers: [StokRepository, StokService],
    controllers: [StokController],
    exports: [StokService]
})
export class StokModule {}