import { HttpException, Injectable } from "@nestjs/common";
import { BarangRepository } from "./barang-repo/repository";
import { SatuanService } from "../satuan/satuan.service";
import { KategoriService } from "../kategori/kategori.service";
import { BarangCreateDTO, BarangResponse } from "./dto/barang.model";
import { ValidationService } from "src/common/validation.service";
import { BarangValidation } from "./barang.validation";

@Injectable()
export class BarangService {
    constructor(
        private readonly barangRepo: BarangRepository,
        private satuanService: SatuanService,
        private kategoriService: KategoriService,
        private validationService: ValidationService
    ) {}

    toBarangReponse(barang: BarangResponse): BarangResponse {
        return {
            id: barang.id,
            kode_barang: barang.kode_barang,
            nama_barang: barang.nama_barang,
            satuan: barang.satuan,
            kategori: barang.kategori
        }
    }

    async barangMustBeExists(
        id: number
    ): Promise<BarangResponse> {
        const barang = await this.barangRepo.findOne(id);

        if(!barang){
            throw new HttpException('barang not found!', 404);
        }

        return this.toBarangReponse(barang);
    }

    async barangCreate(
        request: BarangCreateDTO
    ): Promise<BarangResponse> {
        const requestCreate = this.validationService.validate(BarangValidation.CREATE, request);
        await this.satuanService.satuanMustBeExists(requestCreate.satuanId);
        await this.kategoriService.kategoriMustExists(requestCreate.kategoriId);

        const checkName = await this.barangRepo.countByName(requestCreate.nama_barang);
        const checkCode = await this.barangRepo.countBykode(requestCreate.kode_barang);
        if(checkName != 0){
            throw new HttpException('Nama Barang has already exists', 400);
        }

        if(checkCode != 0){
            throw new HttpException('Kode Barang has already Exists', 400);
        }

        const newBarang = await this.barangRepo.createBarang(requestCreate);

        return  this.toBarangReponse(newBarang);
    }

    async barangUpdate(
        id: number,
        request: BarangCreateDTO
    ): Promise<BarangResponse> {
        const oldBarang = await this.barangMustBeExists(id);
        const requestUpdate = this.validationService.validate(BarangValidation.CREATE, request);
        await this.satuanService.satuanMustBeExists(requestUpdate.satuanId);
        await this.kategoriService.kategoriMustExists(requestUpdate.kategoriId);

        if(requestUpdate.nama_barang != oldBarang.nama_barang){
            const cekNama = await this.barangRepo.countByName(requestUpdate.nama_barang);
            if (cekNama != 0){
                throw new HttpException('Nama Barang has Already exists', 400);
            }
        }

        if(requestUpdate.kode_barang != oldBarang.kode_barang){
            const cekCode = await this.barangRepo.countBykode(requestUpdate.kode_barang);
            if (cekCode != 0){
                throw new HttpException('Kode Barang Has already exists', 400);
            }
        }
        
        const updateBarang = await this.barangRepo.updateBarang(requestUpdate, oldBarang.id);

        return this.toBarangReponse(updateBarang);
    }

    async barangDelete(
        id: number
    ): Promise<BarangResponse>{
        const barang = await this.barangMustBeExists(id);

        const deleteBarang = await this.barangRepo.remove(id);
        
        return this.toBarangReponse(deleteBarang);
    }

    async list(
        take: number,
        skip: number
    ): Promise<BarangResponse[]>{
        const listBarang = await this.barangRepo.findAll(take, skip);

        return listBarang.map((item) => this.toBarangReponse(item))
    }

    async countBarang(): Promise<number>{
        return await this.barangRepo.countAll()
    }

    async search(
        keyword: string
    ): Promise<BarangResponse[]> {
        const searchBarang = await this.barangRepo.searchBarang(keyword);

        // if(searchBarang.length == 0){
        //     throw new HttpException('search not found!', 404);
        // }

        return searchBarang.map((item) => this.toBarangReponse(item));
    }

}