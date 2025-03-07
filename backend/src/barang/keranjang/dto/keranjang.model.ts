import { BarangResponseExtd } from "src/barang/barang/dto/barang.model";

export class KeranjangCreateDTO {
    transaksiId: number;
    nomor_batch: string;
    barangId: number;
    qty: number;
    harga_beli: number;
    harga_jual: number;
    total_harga: number;
    expired_date: Date;
    tanggal: Date;
}

export class KeranjangResponse {
    id: number;
    transaksiId: number;
    nomor_batch: string;
    barangId: number;
    qty: number;
    harga_beli: number;
    harga_jual: number;
    total_harga: number;
    expired_date: Date;
    tanggal: Date;
}

export class KeranjangResponseEx {
    id: number;
    transaksiId: number;
    nomor_batch: string;
    barang: BarangResponseExtd;
    qty: number;
    harga_beli: number;
    harga_jual: number;
    total_harga: number;
    expired_date: Date;
    tanggal: Date;
}

export class KeranjangPayload {
    count: number;
}