import { BatchBarangStokResponse } from "src/barang/batch/dto/batch.model";
export class StokCreateDTO {
    nomor_batch: string;
    type: TypeStok;
    qty: number;
    keterangan: string;
    tanggal: Date;
}

export class StokResponse {
    id: number;
    batch: BatchBarangStokResponse;
    type: string;
    qty: number;
    keterangan: string;
    tanggal: Date;
}

export class StokPayloadCreateMany {
    count: number
}

export type TypeStok = "IN" | "OUT"