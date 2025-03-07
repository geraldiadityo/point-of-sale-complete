import { ZodType, z } from "zod";

export class BatchValidation {
    static readonly CREATE: ZodType = z.object({
        nomor: z.string().min(1).max(100),
        barangId: z.number().max(100).positive(),
        stok: z.number().max(100).positive(),
        harga_beli: z.number().positive(),
        harga_jual: z.number().positive(),
        expirate_date: z.string().transform((str) => new Date(str))
    });
}