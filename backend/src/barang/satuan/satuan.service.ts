import { HttpException, Injectable } from "@nestjs/common";
import { SatuanRepository } from "./satuan-repo/satuan-repository";
import { ValidationService } from "src/common/validation.service";
import { Satuan_barang } from "@prisma/client";
import { SatuanCreateDTO, SatuanResponse } from "./dto/satuan.model";
import { SatuanValidation } from "./satuan.validation";

@Injectable()
export class SatuanService {
    constructor(
        private readonly satuanRepo: SatuanRepository,
        private validationService: ValidationService
    ) {}

    toSatuanReponse(satuan: Satuan_barang): SatuanResponse {
        return {
            id: satuan.id,
            nama_satuan: satuan.nama_satuan
        }
    }

    async satuanMustBeExists(
        id: number
    ): Promise<SatuanResponse>{
        const satuan = await this.satuanRepo.findOne(id);

        if(!satuan){
            throw new HttpException('satuan not found', 404)
        }

        return this.toSatuanReponse(satuan);
    }

    async create(
        request: SatuanCreateDTO
    ): Promise<SatuanResponse>{
        const requestCreate = this.validationService.validate(SatuanValidation.CREATE, request);

        const newSatuan = await this.satuanRepo.createSatuan(requestCreate);

        return this.toSatuanReponse(newSatuan);
    }

    async update(
        request: SatuanCreateDTO,
        id: number
    ): Promise<SatuanResponse>{
        const oldSatuan = await this.satuanMustBeExists(id);
        const requestUpdate = this.validationService.validate(SatuanValidation.CREATE, request);

        const updateSatuan = await this.satuanRepo.updateSatuan(requestUpdate, oldSatuan.id);

        return this.toSatuanReponse(updateSatuan);
    }

    async getAll(): Promise<SatuanResponse[]> {
        const listSatuan = await this.satuanRepo.findAll();

        return listSatuan.map((item) => this.toSatuanReponse(item));
    }

    async remove(
        id: number
    ): Promise<SatuanResponse>{
        const oldSatuan = await this.satuanMustBeExists(id);
        const deleteSatuan = await this.satuanRepo.remove(oldSatuan.id);

        return this.toSatuanReponse(deleteSatuan);
    }
}

