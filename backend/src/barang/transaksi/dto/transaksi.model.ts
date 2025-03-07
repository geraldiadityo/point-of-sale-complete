
import { BarangResponseExtd } from "src/barang/barang/dto/barang.model";
import { BatchBarangResponseExtd } from "src/barang/batch/dto/batch.model";

import { SupplierResponse } from "src/supplier/dto/supplier.model";
import { KeranjangResponseEx } from "src/barang/keranjang/dto/keranjang.model";

export class RequestTransaksi {
    nomor_faktur: string;
    tanggal_faktur: string;
    tanggal_terima: string;
    tanggal_jatuh_tempo: string;
    supplierId: number;
    keterangan?: string;
}

export class RequestDetail {
    barangId: number;
    nomor_batch: string;
    qty: number;
    harga_beli: number;
    harga_jual: number;
    expirate_date: string;
}

export class RequestAllTransac {
    transaksi: RequestTransaksi;
    detail_transaksi: RequestDetail[]
}

export class Detail_TransaksiDTO {
    transaksiId: number;
    barangId: number;
    nomor_batch: string;
    qty: number;
    expirate_date: Date;
    harga_beli: number;
    harga_jual: number;
    tanggal: Date;
}

export class DetailTransaksiPayload {
    count: number;
}

export class CreateTransaksiDTO {
    nomor_faktur: string;
    tanggal_faktur: Date;
    tanggal_terima: Date;
    tanggal_jatuh_tempo: Date;
    supplierId: number;
    keterangan?: string;
    total_bayar: number;
}

export class UpdateAfterCreateDetail {
    total_bayar: number
}

export class TransaksiResponse {
    id: number;
    nomor_faktur: string;
    tanggal_faktur: Date;
    tanggal_terima: Date;
    tanggal_jatuh_tempo: Date;
    supplier: SupplierResponse;
    total_bayar: number;
    status_bayar: boolean;
    status: boolean;
}

export class DetailTransaksiResponse {
    id: number;
    transaksiId: number;
    barang: BarangResponseExtd;
    batch: BatchBarangResponseExtd;
    qty: number;
    expirate_date: Date;
    harga_beli: number;
    harga_jual: number;
    tanggal: Date;
}

export class TransaksiDetailResponse {
    transaksi: TransaksiResponse;
    detail: DetailTransaksiResponse[];
}

export class TransaksiKeranjangResponse {
    transaksi: TransaksiResponse;
    keranjang: KeranjangResponseEx[];
}