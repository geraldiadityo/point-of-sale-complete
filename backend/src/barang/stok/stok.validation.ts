import { ZodType, z } from "zod"

export class StokValidation {
    static readonly CREATE: ZodType = z.object({
        nomor_batch: z.string().min(1).max(100),
        type: z.enum(["IN", "OUT"]),
        qty: z.number().min(1).positive(),
        keterangan: z.string().min(1).max(200),
        tanggal: z.date()
    });
}