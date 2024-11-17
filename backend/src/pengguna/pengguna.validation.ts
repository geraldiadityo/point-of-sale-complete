import { ZodType, z } from "zod";
export class PenggunaValidation {
    static readonly CREATE: ZodType = z.object({
        username: z.string().min(1).max(100),
        password: z.string().min(8).max(100),
        confirm_password: z.string().min(8).max(100),
        pegawaiId: z.number().min(1).positive(),
        roleId: z.number().min(1).positive()
    }).refine((data) =>  data.password === data.confirm_password, {
        message: "Confirm password don't match",
        path: ["confirm_password"]
    });
}