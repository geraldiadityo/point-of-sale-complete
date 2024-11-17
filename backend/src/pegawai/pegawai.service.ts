import { HttpException, Injectable } from "@nestjs/common";
import { PegawaiRepository } from "./pegawai-repository/pegawai-repository";
import { ValidationService } from "../common/validation.service";
import { Pegawai } from "@prisma/client";
import { PegawaiCreateDTO, PegawaiRequestDTO, PegawaiResponse } from "./dto/pegawai.model";
import { PegawaiValidation } from "./pegawai.validation";

@Injectable()
export class PegawaiService {
    constructor(
        private readonly pegawaiRepo: PegawaiRepository,
        private validationService: ValidationService
    ) {}

    toPegawaiResponse(pegawai: Pegawai): PegawaiResponse {
        return {
            id: pegawai.id,
            nk: pegawai.nk,
            nik: pegawai.nik,
            nama_lengkap: pegawai.nama_lengkap,
            alamat: pegawai.alamat
        }
    }

    async generateNoPegawai(): Promise<string> {
        const lastRecord = await this.pegawaiRepo.lastRecord();
        const prefix = 'NK';
        let formattedNumber: string;
        
        if(lastRecord){
            const lastNumber: number = parseInt(lastRecord.nk.split('-')[1], 10);
            const theNumber: number = lastNumber + 1;
            formattedNumber = String(theNumber).padStart(4,'0');
        } else {
            formattedNumber = String(1).padStart(4,'0');
        }

        const numberPegawai = `${prefix}-${formattedNumber}`;

        return numberPegawai;
    }

    async pegawaiMustExists(
        id: number
    ): Promise<PegawaiResponse> {
        const pegawai = await this.pegawaiRepo.findOne(id);
        if (!pegawai){
            throw new HttpException('not found pegawai!', 404);
        }

        return this.toPegawaiResponse(pegawai);
    }

    async create(
        request: PegawaiRequestDTO
    ): Promise<PegawaiResponse> {
        const requestCreate = this.validationService.validate(PegawaiValidation.CREATE, request);
        const cekNik = await this.pegawaiRepo.findByNik(requestCreate.nik);
        if(cekNik){
            throw new HttpException('NIK has already exists', 400);
        }

        const nk: string = await this.generateNoPegawai();
        const dataSend: PegawaiCreateDTO = {
            ...requestCreate,
            nk: nk
        }

        const pegawai = await this.pegawaiRepo.createPegawai(dataSend);

        return this.toPegawaiResponse(pegawai);
    }

    async update(
        id: number,
        request: PegawaiRequestDTO
    ): Promise<PegawaiResponse> {
        const pegawaiBefore = await this.pegawaiMustExists(id);
        const requestUpdate = this.validationService.validate(PegawaiValidation.CREATE, request);
        if (pegawaiBefore.nik != requestUpdate.nik){
            const cekNik = await this.pegawaiRepo.findNikExclude(requestUpdate.nik, pegawaiBefore.nik);

            if(cekNik){
                throw new HttpException('NIK has already exists', 400);
            }
        }

        const updatePegawai = await this.pegawaiRepo.updatePegawai(requestUpdate, pegawaiBefore.id);

        return this.toPegawaiResponse(updatePegawai);
    }

    async get(
        id: number
    ): Promise<PegawaiResponse> {
        const pegawai = await this.pegawaiMustExists(id);

        return this.toPegawaiResponse(pegawai);
    }

    async list(
        skip: number,
        pageSize: number
    ): Promise<PegawaiResponse[]> {
        const listPegawai = await this.pegawaiRepo.findAll(skip, pageSize);

        return listPegawai.map((pegawai) => this.toPegawaiResponse(pegawai))
    }

    async search(
        keyword: string
    ): Promise<PegawaiResponse[]> {
        const listSearch = await this.pegawaiRepo.search(keyword);

        if(listSearch.length == 0){
            throw new HttpException('not found!', 404);
        }

        return listSearch.map((pegawai) => this.toPegawaiResponse(pegawai))
    }

    async remove(
        id: number
    ): Promise<PegawaiResponse> {
        const pegawai = await this.pegawaiMustExists(id);

        const delPegawai = await this.pegawaiRepo.remove(id);

        return this.toPegawaiResponse(delPegawai);
    }

    async countAllPegawai(): Promise<number> {
        return await this.pegawaiRepo.countAll();
    }

}