import { HttpException, Injectable } from "@nestjs/common";
import { KeranjangRepository } from "./repository/keranjang-repository";
import { TransaksiService } from "../transaksi/transaksi.service";
import { Keranjang } from "@prisma/client";
import { KeranjangCreateDTO, KeranjangPayload, KeranjangResponse, KeranjangResponseEx } from "./dto/keranjang.model";

@Injectable()
export class KeranjangService {
    constructor(
        private readonly keranjangRepository: KeranjangRepository,
    ) {}

    toKeranjangResponse(keranjang: Keranjang): KeranjangResponse {
        return {
            id: keranjang.id,
            transaksiId: keranjang.transaksiId,
            nomor_batch: keranjang.nomor_batch,
            barangId: keranjang.barangId,
            qty: keranjang.qty,
            harga_beli: keranjang.harga_beli,
            harga_jual: keranjang.harga_jual,
            total_harga: keranjang.total_harga,
            expired_date: keranjang.expired_date,
            tanggal: keranjang.tanggal
        }
    }

    async itemKeranjangMustExists(
        id: number
    ): Promise<KeranjangResponse> {
        const item = await this.keranjangRepository.getItemKeranjangById(id);

        if(!item){
            throw new HttpException('item not found!', 404)
        }

        return this.toKeranjangResponse(item);
    }
    
    async createKeranjang(
        data: KeranjangCreateDTO[]
    ): Promise<KeranjangPayload> {
        const keranjangAdd = await this.keranjangRepository.insertKeranjang(data);

        return keranjangAdd;
    }

    async editQtyKeranjang(
        id: number,
        qty: number
    ): Promise<KeranjangResponse> {
        const oldData = await this.itemKeranjangMustExists(id);

        const updateItemKeranjang = await this.keranjangRepository.editQty(oldData.id, qty);

        return this.toKeranjangResponse(updateItemKeranjang);
    }

    async listKeranjangByIdTransaksi(
        transakiId: number
    ): Promise<KeranjangResponseEx[]> {
        const listData = await this.keranjangRepository.listByIdTransaksi(transakiId);

        return listData;
    };

}