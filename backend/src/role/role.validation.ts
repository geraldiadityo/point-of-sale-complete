import { ZodType, z } from "zod";

export class RoleValidation {
    static readonly CREATE: ZodType = z.object({
        nama_role: z.string().min(1).max(200)
    });
}