import { ZodType,z } from "zod"
export class BarangValidation {
    static readonly CREATE: ZodType = z.object({
        kode_barang: z.string().min(1).max(100),
        nama_barang: z.string().min(1).max(100),
        satuanId: z.number().min(1).positive(),
        kategoriId: z.number().min(1).positive()
    });
}