import { ZodType, z } from "zod";

export class KategoriValidation {
    static readonly CREATE: ZodType = z.object({
        nama_kategori: z.string().min(1).max(100)
    });
}