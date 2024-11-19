import { HttpException, Injectable } from "@nestjs/common";
import { KategoriRepository } from "./kategori-repo/kategori-repository";
import { Kategori_barang } from "@prisma/client";
import { KategoriCreateDTO, KategoriResponse } from "./dto/kategori.mode";
import { ValidationService } from "src/common/validation.service";
import { KategoriValidation } from "./kategori.validation";

@Injectable()
export class KategoriService {
    constructor(
        private readonly kategoriRepo: KategoriRepository,
        private validationService: ValidationService
    ) {}

    toKategoriReponse(kategori: Kategori_barang): KategoriResponse {
        return {
            id: kategori.id,
            nama_kategori: kategori.nama_kategori
        }
    }

    async kategoriMustExists(
        id: number
    ): Promise<KategoriResponse>{
        const kategori = await this.kategoriRepo.findOne(id);
        if (!kategori){
            throw new HttpException('kategori not found!', 404);
        }

        return this.toKategoriReponse(kategori);
    }

    async create(
        request: KategoriCreateDTO
    ): Promise<KategoriResponse>{
        const requestCreate = this.validationService.validate(KategoriValidation.CREATE, request);
        const newKategori = await this.kategoriRepo.createKategori(requestCreate);

        return this.toKategoriReponse(newKategori);
    }

    async update(
        id: number,
        request: KategoriCreateDTO
    ): Promise<KategoriResponse>{
        const oldKategori = await this.kategoriMustExists(id);
        const requestUpdate = this.validationService.validate(KategoriValidation.CREATE, request);

        const updateKateori = await this.kategoriRepo.updateKategori(requestUpdate, oldKategori.id);

        return this.toKategoriReponse(updateKateori);
    }

    async list(): Promise<KategoriResponse[]> {
        const listKategori = await this.kategoriRepo.findAll();

        return listKategori.map((item) => this.toKategoriReponse(item));
    }

    async remove(
        id: number
    ): Promise<KategoriResponse>{
        const oldKategori = await this.kategoriMustExists(id);

        const removeKategori = await this.kategoriRepo.remove(oldKategori.id);
        
        return this.toKategoriReponse(removeKategori);
    }
}