import { ZodType, z } from "zod";

export class PegawaiValidation {
    static readonly CREATE: ZodType = z.object({
        nik: z.string().min(16).max(20),
        nama_lengkap: z.string().min(1).max(100),
        alamat: z.string().max(200).optional()
    });
}