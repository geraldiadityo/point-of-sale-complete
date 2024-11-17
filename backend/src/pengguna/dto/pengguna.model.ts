import { RoleResponse } from "src/role/dto/role.model";
import { PegawaiResponse } from "src/pegawai/dto/pegawai.model";
export class PenggunaCreateRequest {
    username: string;
    password: string;
    confirm_password: string;
    pegawaiId: number;
    roleId: number;
}

export class PenggunaResponse {
    username: string;
    pegawai: PegawaiResponse;
    role: RoleResponse;
    status: boolean
}