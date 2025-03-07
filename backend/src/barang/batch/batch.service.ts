import { HttpException, Injectable } from "@nestjs/common";
import { BatchRepository } from "./repository/batch-repository";
import { BarangService } from "../barang/barang.service";
import { ValidationService } from "src/common/validation.service";
import { Batch } from "@prisma/client";
import { BatchBarangCreateManyPayload, BatchBarangResponse, BatchCreateDTO } from "./dto/batch.model";
import { BatchValidation } from "./batch.validation";
import { Cron, CronExpression } from "@nestjs/schedule";
import { StokService } from "../stok/stok.service";
import { StokCreateDTO } from "../stok/dto/stok.model";

@Injectable()
export class BatchService {
    constructor(
        private readonly batchRepository: BatchRepository,
        private barangService: BarangService,
        private stokService: StokService,
        private validationService: ValidationService,
        
    ) {}

    toBatchResponse(batch: Batch): BatchBarangResponse {
        return {
            nomor: batch.nomor,
            stok: batch.stok,
            harga_beli: batch.harga_beli,
            harga_jual: batch.harga_jual,
            expirate_date: batch.expirate_date
        }
    }

    async batchMustBeExists(
        nomor: string
    ): Promise<BatchBarangResponse> {
        const batch = await this.batchRepository.findOneByNomor(nomor);

        if(!batch){
            throw new HttpException('batch not found!', 404);
        }

        return this.toBatchResponse(batch);
    }

    async checkByNomor(
        nomor: string
    ): Promise<boolean> {
        const batch = await await this.batchRepository.findOneByNomor(nomor);
        if (!batch){
            return false
        }

        return true;
    }

    async listBatchByBarang(
        idBarang: number
    ): Promise<BatchBarangResponse[]> {
        const listBatch = await this.batchRepository.listByIdBarang(idBarang);
        
        return listBatch.map((item) => this.toBatchResponse(item));
    }

    async createBatch(
        request: BatchCreateDTO
    ): Promise<BatchBarangResponse> {
        const requestCreate = this.validationService.validate(BatchValidation.CREATE, request);
        await this.barangService.barangMustBeExists(requestCreate.barangId);
        
        const newBatch = await this.batchRepository.createBatch(requestCreate);

        return this.toBatchResponse(newBatch)
    }

    async createManyBatch(
        data: BatchCreateDTO[]
    ): Promise<BatchBarangCreateManyPayload>{
        return await this.batchRepository.createManyBatch(data);
    }

    async updateBatch(
        nomor: string,
        stok: number
    ): Promise<BatchBarangResponse> {
        const updateBatch = await this.batchRepository.updateStok(nomor, stok);

        return this.toBatchResponse(updateBatch);
    }

    async updateAfterTransaksi(
        nomor: string,
        stok: number,
        harga_beli: number,
        harga_jual: number
    ): Promise<BatchBarangResponse> {
        const incrementStok = await this.batchRepository.updateAfterTransaksi(nomor, stok, harga_beli, harga_jual);

        return this.toBatchResponse(incrementStok);
    }

    async decrementStok(
        nomor: string,
        stok: number
    ): Promise<BatchBarangResponse> {
        const updateBatch = await this.batchRepository.decrementStok(nomor, stok);

        return this.toBatchResponse(updateBatch);
    }

    // @Cron(CronExpression.EVERY_DAY_AT_5PM)
    // async handlerExpiredItem(){
    //     console.log('running expired check!')
    //     const dateNow = new Date();
    //     const expiredItems = await this.batchRepository.itemExpired();
    //     if(expiredItems.length > 0) {
    //         const dataExpired: StokCreateDTO[] = expiredItems.map((item) => ({
    //             nomor_batch: item.nomor,
    //             type: 'OUT',
    //             qty: item.stok,
    //             keterangan: 'Expired',
    //             tanggal: dateNow
    //         }));
            
    //         await this.stokService.createManyStok(dataExpired);
            
    //         expiredItems.map(async (item) => {
    //             await this.batchRepository.updateStatusFalse(item.nomor);
    //         });

    //         console.log(`item kadaluarsa :${expiredItems.length}`);
    //     } else {
    //         console.log('nothin expired item!')
    //     }
    // }
}