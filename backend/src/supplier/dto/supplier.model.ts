export class SupplierCreateDTO {
    nama_supplier: string;
    nomor_telp: string;
    alamat: string;
    deskripsi?: string;
}

export class SupplierResponse {
    id: number;
    nama_supplier: string;
    nomor_telp: string;
    alamat:string;
    deskripsi: string;
}
