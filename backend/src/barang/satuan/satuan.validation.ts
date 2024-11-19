import { ZodType,z } from "zod";

export class SatuanValidation {
    static readonly CREATE: ZodType = z.object({
        nama_satuan: z.string().min(1).max(100)
    });
}
