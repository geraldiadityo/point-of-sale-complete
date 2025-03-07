import { Body, Controller, Delete, Get, HttpCode, HttpException, Param, ParseIntPipe, Patch, Post, Query } from "@nestjs/common";
import { TransaksiService } from "./transaksi.service";
import { WebModel } from "src/model/web.model";
import { CreateTransaksiDTO, Detail_TransaksiDTO, RequestAllTransac, TransaksiDetailResponse, TransaksiKeranjangResponse, TransaksiResponse, UpdateAfterCreateDetail } from "./dto/transaksi.model";
import { BatchService } from "../batch/batch.service";
import { BatchCreateDTO } from "../batch/dto/batch.model";
import { KeranjangService } from "../keranjang/keranjang.service";
import { KeranjangCreateDTO } from "../keranjang/dto/keranjang.model";
import { StokCreateDTO } from "../stok/dto/stok.model";
import { StokService } from "../stok/stok.service";

@Controller('/api/transaksi')
export class TransaksiController {
    constructor(
        private transaksiService: TransaksiService,
        private batchService: BatchService,
        private keranjangService: KeranjangService,
        private stokService: StokService,
    ) {}

    @Get("/view")
    @HttpCode(200)
    async list(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<TransaksiResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.transaksiService.listAll(pageSize, skip);
        const totalItem = await this.transaksiService.countAllTransaksi();
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            currentPage: page,
            totalItem: totalItem,
            totalPages: totalPage,
        }
    }

    @Get('/list-by-status')
    @HttpCode(200)
    async listByStatus(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('status') status: string
    ): Promise<WebModel<TransaksiResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.transaksiService.listByStatus(pageSize, skip, status);
        const totalItem = await this.transaksiService.countAllTransaksiByStatus(status);
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            currentPage: page,
            totalItem: totalItem,
            totalPages: totalPage
        }
    }

    @Get('/list-by-final')
    @HttpCode(200)
    async listByFinal(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number,
        @Query('status') status: string
    ): Promise<WebModel<TransaksiResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.transaksiService.listByFinal(pageSize, skip, status);
        const totalItem = await this.transaksiService.countAllTransaksiByFinal(status);
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            currentPage: page,
            totalItem: totalItem,
            totalPages: totalPage,
            message: 'success'
        }
    }

    @Get('/list-canceled')
    @HttpCode(200)
    async listCanceled(
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<TransaksiResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.transaksiService.listCanceled(pageSize, skip);
        const totalItem = await this.transaksiService.countAllTransaksiCancel();
        const totalPage = Math.ceil(totalItem/pageSize);


        return {
            data: result,
            currentPage: page,
            totalItem: totalItem,
            totalPages: totalPage
        }
    }

    @Get('/search-transaksi')
    @HttpCode(200)
    async search(
        @Query('keyword') keyword: string,
        @Query('page', ParseIntPipe) page: number,
        @Query('pageSize', ParseIntPipe) pageSize: number
    ): Promise<WebModel<TransaksiResponse[]>> {
        const skip = (page - 1) * pageSize;
        const result = await this.transaksiService.searchTransaksi(keyword, pageSize, skip);
        const totalItem = await this.transaksiService.countAllTransaksi();
        const totalPage = Math.ceil(totalItem/pageSize);

        return {
            data: result,
            currentPage: page,
            totalItem: totalItem,
            totalPages: totalPage,
            message: `result found with result match: ${result.length}`
        }
    }

    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<TransaksiResponse>> {
        const result = await this.transaksiService.transaksiMustbeExists(id);

        return {
            data: result,
            message: 'found it'
        }
    }

    @Get('/get-by-nomor/:nomor')
    @HttpCode(200)
    async getByNomor(
        @Param('nomor') nomor: string
    ): Promise<WebModel<TransaksiResponse>> {
        const result = await this.transaksiService.getByNomor(nomor);

        return {
            data: result,
            message: 'found it'
        }
    }

    @Post('/create-transaksi')
    @HttpCode(201)
    async createTransaksi(
        @Body() request: RequestAllTransac
    ): Promise<WebModel<boolean>> {
        const dataTransaksi = request.transaksi;
        console.log(request);
        const requestTnitTransaksi: CreateTransaksiDTO = {
            nomor_faktur: dataTransaksi.nomor_faktur,
            tanggal_faktur: new Date(dataTransaksi.tanggal_faktur),
            tanggal_terima: new Date(dataTransaksi.tanggal_terima),
            tanggal_jatuh_tempo: new Date(dataTransaksi.tanggal_jatuh_tempo),
            supplierId: dataTransaksi.supplierId,
            total_bayar: 0
        };
        const initTransaksi = await this.transaksiService.createTransaksi(requestTnitTransaksi);
        const requestDetailTransaksi = request.detail_transaksi;
        const detailTransaksiTransform: Detail_TransaksiDTO[] = requestDetailTransaksi.map((item) => ({
            transaksiId: initTransaksi.id,
            barangId: item.barangId,
            nomor_batch: item.nomor_batch,
            qty: item.qty,
            expirate_date: new Date(item.expirate_date),
            harga_beli: item.harga_beli,
            harga_jual: item.harga_jual,
            tanggal: initTransaksi.tanggal_faktur
        }));

        const itemKeranjang: KeranjangCreateDTO[] = detailTransaksiTransform.map((item) => ({
            transaksiId: initTransaksi.id,
            nomor_batch: item.nomor_batch,
            barangId: item.barangId,
            qty: item.qty,
            harga_beli: item.harga_beli,
            harga_jual: item.harga_jual,
            total_harga: item.harga_beli * item.qty,
            expired_date: item.expirate_date,
            tanggal: initTransaksi.tanggal_faktur
        }));

        const keranjang = await this.keranjangService.createKeranjang(itemKeranjang);

        if (keranjang.count != detailTransaksiTransform.length){
            throw new HttpException('Transaksi Error with issue', 500);
        }
        let newTotal: number = 0
        detailTransaksiTransform.map((item) => {
            newTotal += item.qty * item.harga_beli;
        });

        const updateDataAfterAddKeranjang: UpdateAfterCreateDetail = {
            total_bayar: newTotal
        };

        await this.transaksiService.updateAfterDetail(initTransaksi.id, updateDataAfterAddKeranjang);


            return {
                data: true,
                message: `transaksi with nomor faktur: ${initTransaksi.nomor_faktur} was successfully created with ${keranjang.count} item`
            }
    }

    @Patch('/change-status-bayar/:id')
    @HttpCode(200)
    async changeStatus(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>>{
        const exists = await this.transaksiService.transaksiMustbeExists(id);
        const transaksi = await this.transaksiService.changeStatusBayar(exists.id);

        return {
            data: true,
            message: `status bayar transaksi dengan nomor faktur: ${transaksi.nomor_faktur} telah di rubah`
        }
    }

    @Patch('/final-transaksi/:id')
    @HttpCode(200)
    async finalTransaksi(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<TransaksiResponse>> {
        const exists = await this.transaksiService.transaksiMustbeExists(id);
        
        const itemKeranjang = await this.keranjangService.listKeranjangByIdTransaksi(exists.id);
        const batchCheck = await Promise.all(
            itemKeranjang.map(async (item) => {
                const batchExists = await this.batchService.checkByNomor(item.nomor_batch);

                return { batchExists, item }
            })
        );

        const updateBatch = batchCheck.filter(({ batchExists }) => batchExists)
                .map(({ item }) => ({
                    nomor: item.nomor_batch,
                    qty: item.qty,
                    harga_beli: item.harga_beli,
                    harga_jual: item.harga_jual
                }));
        
        const createNewBatch: BatchCreateDTO[] = batchCheck.filter(({ batchExists }) => !batchExists)
                .map(({ item }) => ({
                    nomor: item.nomor_batch,
                    barangId: item.barang.id,
                    stok: item.qty,
                    expirate_date: new Date(item.expired_date),
                    harga_beli: item.harga_beli,
                    harga_jual: item.harga_jual,
                }));

        await this.batchService.createManyBatch(createNewBatch);
        updateBatch.map(async (item) => {
            await this.batchService.updateAfterTransaksi(item.nomor, item.qty, item.harga_beli, item.harga_jual);
        });

        const itemKeranjangTransform: Detail_TransaksiDTO[] = itemKeranjang.map((item) => ({
            transaksiId: item.transaksiId,
            barangId: item.barang.id,
            nomor_batch: item.nomor_batch,
            qty: item.qty,
            expirate_date: new Date(item.expired_date),
            harga_beli: item.harga_beli,
            harga_jual: item.harga_jual,
            tanggal: new Date()
        }));

        await this.transaksiService.createDetailTransaksi(itemKeranjangTransform);
        const itemStokTransform: StokCreateDTO[] = itemKeranjang.map((item) => ({
            nomor_batch: item.nomor_batch,
            type: "IN",
            qty: item.qty,
            keterangan: "New Stok",
            tanggal: new Date()
        }))

        await this.stokService.createManyStok(itemStokTransform);

        const updateTransaksi = await this.transaksiService.changeStatusFinal(exists.id);

        return {
            data: updateTransaksi,
            message: `status transaksi with no faktur: ${exists.nomor_faktur} was final successfully`
        }

    }

    @Delete('/cancel-transaksi/:id')
    @HttpCode(200)
    async flagedTransaksi(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>> {
        const exists = await this.transaksiService.transaksiMustbeExists(id);
        const deletedTransaksi = await this.transaksiService.flagedTransaksi(exists.id);
        const detailTransaksi = await this.transaksiService.getDetailTransaksi(deletedTransaksi.id);
        detailTransaksi.map(async (item) => await this.batchService.decrementStok(item.batch.nomor, item.qty));

        return {
            data: true,
            message: `Transaksi with nomor faktur: ${deletedTransaksi.nomor_faktur} was canceled successfully`
        }
    }

    @Get('/get-detail-by-nomor/:nomor')
    @HttpCode(200)
    async getDetailTransaksi(
        @Param('nomor') nomor: string
    ): Promise<WebModel<TransaksiDetailResponse>> {
        const result = await this.transaksiService.getDetailTransaksiByNomor(nomor);

        return {
            data: result
        }
    }

    @Get('/get-keranjang-by-nomor/:nomor')
    @HttpCode(200)
    async getKeranjangTransaksi(
        @Param('nomor') nomor: string
    ): Promise<WebModel<TransaksiKeranjangResponse>> {
        const result = await this.transaksiService.getKeranajangByNomor(nomor);

        return {
            data: result
        }
    }
}