import { HttpException, Injectable } from "@nestjs/common";
import { TransaksiRepository } from "./repository/transaksi-repository";
import { CreateTransaksiDTO, Detail_TransaksiDTO, DetailTransaksiPayload, DetailTransaksiResponse, TransaksiDetailResponse, TransaksiKeranjangResponse, TransaksiResponse, UpdateAfterCreateDetail } from "./dto/transaksi.model";
import { KeranjangService } from "../keranjang/keranjang.service";

@Injectable()
export class TransaksiService {
    constructor(
        private readonly transaksiRepository: TransaksiRepository,
        private keranjangService: KeranjangService,
    ) {}

    toTransaksiResponse(transaksi: TransaksiResponse): TransaksiResponse {
        return {
            id: transaksi.id,
            nomor_faktur: transaksi.nomor_faktur,
            tanggal_faktur: transaksi.tanggal_faktur,
            tanggal_terima: transaksi.tanggal_terima,
            tanggal_jatuh_tempo: transaksi.tanggal_jatuh_tempo,
            supplier: transaksi.supplier,
            total_bayar: transaksi.total_bayar,
            status_bayar: transaksi.status_bayar,
            status: transaksi.status
        }
    }

    async countAllTransaksi(): Promise<number> {
        return await this.transaksiRepository.countAll();
    }

    async countAllTransaksiByStatus(
        status: string
    ): Promise<number> {
        let isStatus: boolean = true;
        if(status === 'Belum'){
            isStatus = false
        }
        return await this.transaksiRepository.countAllByStatus(isStatus);
    }

    async countAllTransaksiByFinal(
        status: string
    ): Promise<number> {
        let isStatus: boolean = true;
        if(status === 'Belum'){
            isStatus = false
        }

        return await this.transaksiRepository.countAllByFinal(isStatus);
    }

    async countAllTransaksiCancel(): Promise<number> {
        return await this.transaksiRepository.countAllCanceled();

    }

    async transaksiMustbeExists(
        id: number
    ): Promise<TransaksiResponse> {
        const transaksi = await this.transaksiRepository.findOne(id);
        if(!transaksi){
            throw new HttpException('transaksi not found!', 404);
        }

        return this.toTransaksiResponse(transaksi)
    }

    async listAll(
        take: number,
        skip: number
    ): Promise<TransaksiResponse[]> {
        const listTransaksi = await this.transaksiRepository.listTransaksi(take, skip);

        return listTransaksi.map((item) => this.toTransaksiResponse(item));
    }

    async listAllFinalLunasToday(): Promise<TransaksiResponse[]> {
        const today = new Date();
        const startDate = new Date(today.setHours(0,0,0,0));
        const endDate = new Date(today.setHours(23,59,59,999));

        const listTransaksi = await this.transaksiRepository.dataTransaksiAll(startDate, endDate);

        return listTransaksi.map((item) => this.toTransaksiResponse(item));
    }

    async listByStatus(
        take: number,
        skip: number,
        status: string
    ): Promise<TransaksiResponse[]> {
        let isStatus: boolean = true;
        if(status === 'Belum'){
            isStatus = false
        }
        const listTransaksi = await this.transaksiRepository.listTransaksiByStatus(take, skip, isStatus);

        return listTransaksi.map((item) => this.toTransaksiResponse(item))
    }

    async listByFinal(
        take: number,
        skip: number,
        status: string
    ): Promise<TransaksiResponse[]> {
        let isStatus: boolean = true;
        if(status === 'Belum'){
            isStatus = false;
        }

        const listTransaksi = await this.transaksiRepository.listTransaksiByStatusFinal(take, skip, isStatus);

        return listTransaksi.map((item) => this.toTransaksiResponse(item));
    }

    async listCanceled(
        take: number,
        skip: number
    ): Promise<TransaksiResponse[]> {
        const listTransaksi = await this.transaksiRepository.listTransaksiCancel(take, skip);
        
        return listTransaksi.map((item) => this.toTransaksiResponse(item))
    }

    async searchTransaksi(
        keyword: string,
        take: number,
        skip: number
    ): Promise<TransaksiResponse[]> {
        const searchTransaksi = await this.transaksiRepository.searchTransaksi(keyword, take, skip);

        if(searchTransaksi.length == 0){
            throw new HttpException('search result not found!', 404);
        }

        return searchTransaksi.map((item) => this.toTransaksiResponse(item));
    }


    async getByNomor(
        nomor_faktur: string
    ): Promise<TransaksiResponse>{
        const transaksi = await this.transaksiRepository.findByNomor(nomor_faktur);

        if(!transaksi){
            throw new HttpException('result with nomor faktur not found!', 404);
        }

        return this.toTransaksiResponse(transaksi);
    }

    async createTransaksi(
        data: CreateTransaksiDTO
    ): Promise<TransaksiResponse> {
        const transaksi = await this.transaksiRepository.createTransaksi(data);

        return this.toTransaksiResponse(transaksi);
    };

    async createDetailTransaksi(
        data: Detail_TransaksiDTO[]
    ): Promise<DetailTransaksiPayload> {
        const detailTransaksi = await this.transaksiRepository.createDetailTransaksi(data);


        return detailTransaksi;
    }


    async getDetailTransaksi(
        transaksiId: number
    ): Promise<DetailTransaksiResponse[]>{
        const listDetailTransaksi = await this.transaksiRepository.detailByIdTransaction(transaksiId);

        return listDetailTransaksi;
    }

    async getKeranajangByNomor(
        nomor: string
    ): Promise<TransaksiKeranjangResponse> {
        const transaksi = await this.transaksiRepository.findByNomor(nomor);
        if(!transaksi){
            throw new HttpException('transaksi not found!', 404);
        }

        const keranjang = await this.keranjangService.listKeranjangByIdTransaksi(transaksi.id);

        const responseTransac: TransaksiKeranjangResponse = {
            transaksi: transaksi,
            keranjang: keranjang
        }

        return responseTransac;
    }

    async getDetailTransaksiByNomor(
        nomor_faktur: string
    ): Promise<TransaksiDetailResponse> {
        const transaksi = await this.transaksiRepository.findByNomor(nomor_faktur);
        if(!transaksi){
            throw new HttpException('not found transaksi!!', 404);
        }

        const detailTransaksi = await this.getDetailTransaksi(transaksi.id);

        const returnData: TransaksiDetailResponse = {
            transaksi: transaksi,
            detail: detailTransaksi
        }

        return returnData;
    }

    async updateAfterDetail(
        transaksiId: number,
        data: UpdateAfterCreateDetail
    ): Promise<TransaksiResponse> {
        const updateAfter = await this.transaksiRepository.updateAfterDetail(transaksiId, data);

        return this.toTransaksiResponse(updateAfter);
    }

    async changeStatusBayar(
        id: number
    ): Promise<TransaksiResponse> {
        const updateStatusBayar = await this.transaksiRepository.changeStatusBayar(id);

        return this.toTransaksiResponse(updateStatusBayar);
    }

    async changeStatusFinal(
        id: number
    ): Promise<TransaksiResponse> {
        const updateStatusFinal = await this.transaksiRepository.changeStatusFinal(id);

        return this.toTransaksiResponse(updateStatusFinal);
    }
    
    async flagedTransaksi(
        id: number
    ): Promise<TransaksiResponse> {
        const flagedTransaksi = await this.transaksiRepository.flagedTransaksi(id);

        return this.toTransaksiResponse(flagedTransaksi);
    }

}