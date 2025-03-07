import { SatuanResponse } from "src/barang/satuan/dto/satuan.model";
import { KategoriResponse } from "src/barang/kategori/dto/kategori.mode";

export class BarangCreateDTO {
    kode_barang: string;
    nama_barang: string;
    satuanId: number;
    kategoriId: number;
}

export class BarangResponse {
    id: number;
    kode_barang: string;
    nama_barang: string;
    satuan: SatuanResponse;
    kategori: KategoriResponse
}

export class BarangResponseExtd {
    id: number;
    kode_barang: string;
    nama_barang: string;
}
