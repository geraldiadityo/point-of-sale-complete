import { HttpException, Injectable } from "@nestjs/common";
import { PenggunaRepository } from "./pengguna-repository/pengguna-repository";
import { ValidationService } from "src/common/validation.service";
import * as bcrypt from 'bcrypt';
import { PenggunaCreateRequest, PenggunaResponse } from "./dto/pengguna.model";
import { RoleService } from "src/role/role.service";
import { PegawaiService } from "src/pegawai/pegawai.service";
import { PenggunaValidation } from "./pengguna.validation";

@Injectable()
export class PenggunaService {
    constructor(
        private readonly PenggunaRepo: PenggunaRepository,
        private validationServies: ValidationService,
        private roleService: RoleService,
        private pegawaiService: PegawaiService
    ) {}

    toPenggunaResponse(pengguna: PenggunaResponse): PenggunaResponse {
        return {
            username: pengguna.username,
            pegawai: pengguna.pegawai,
            role: pengguna.role,
            status: pengguna.status
        }
    }

    async penggunaMustExists(
        username: string
    ): Promise<PenggunaResponse> {
        const pengguna = await this.PenggunaRepo.findOne(username);

        if(!pengguna){
            throw new HttpException('pengguna not found', 404);
        }
        
        return this.toPenggunaResponse(pengguna)
    }

    async checkUserNameHasAlready(
        username: string
    ): Promise<number> {
        const check = await this.PenggunaRepo.countByUsername(username);
        if(check != 0){
            throw new HttpException('Username has already taken', 400);
        }

        return check;
    }

    async countAll(): Promise<number> {
        return await this.PenggunaRepo.countAll();
    }

    async create(
        request: PenggunaCreateRequest
    ): Promise<PenggunaResponse> {
        const createRequest = this.validationServies.validate(PenggunaValidation.CREATE, request);
        await this.pegawaiService.pegawaiMustExists(createRequest.pegawaiId);
        await this.roleService.roleMustExists(createRequest.roleId);
        await this.checkUserNameHasAlready(createRequest.username);

        createRequest.password = await bcrypt.hash(createRequest.password, 10);
        const pengguna = await this.PenggunaRepo.createPengguna(createRequest);

        return this.toPenggunaResponse(pengguna)
    }

    async list(
        skip: number,
        take: number
    ): Promise<PenggunaResponse[]> {
        const listPengguna = await this.PenggunaRepo.findAll(skip, take);
        
        return listPengguna.map((item) => this.toPenggunaResponse(item));
    }

    async get(
        username: string
    ): Promise<PenggunaResponse> {
        const pengguna = await this.penggunaMustExists(username);

        return this.toPenggunaResponse(pengguna);
    }

    async search(
        keyword: string
    ): Promise<PenggunaResponse[]> {
        const search = await this.PenggunaRepo.search(keyword);

        if(search.length == 0){
            throw new HttpException('not found search', 404);
        }

        return search.map((item) => this.toPenggunaResponse(item))
    }

    async remove(
        username: string
    ): Promise<PenggunaResponse> {
        const pengguna = await this.penggunaMustExists(username);

        const deletePengguna = await this.PenggunaRepo.remove(pengguna.username);


        return this.toPenggunaResponse(deletePengguna);
    }

    
}