import { ZodType, z } from "zod";
export class SupplierValidation {
    static readonly CREATE: ZodType = z.object({
        nama_supplier: z.string().min(1).max(100),
        nomor_telp: z.string().min(1).max(20),
        alamat: z.string().min(1).max(100),
        deskripsi: z.string().min(1).max(200).optional()
    });
}