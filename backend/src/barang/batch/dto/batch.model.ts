import { BarangResponse, BarangResponseExtd } from "src/barang/barang/dto/barang.model";

// import { BarangResponse } from "src/barang/barang/dto/barang.model";
export class BatchCreateDTO {
    nomor: string;
    barangId: number;
    stok: number;
    harga_beli: number;
    harga_jual: number;
    expirate_date: Date;
}

export class BatchBarangResponse {
    nomor: string;
    // barang: BarangResponse;
    stok: number;
    harga_beli: number;
    harga_jual: number;
    expirate_date: Date;
}

export class BatchBarangCreateManyPayload {
    count: number
}

export class BatchBarangResponseExtd {
    nomor: string;
    stok: number;
    expirate_date: Date;
}

export class BatchBarangStokResponse {
    nomor: string;
    barang: BarangResponseExtd;
}