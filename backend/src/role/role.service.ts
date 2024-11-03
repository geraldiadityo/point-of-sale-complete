import { HttpException, Injectable } from "@nestjs/common";
import { RoleRepository } from "./role-repository/role-repository";
import { ValidationService } from "../common/validation.service";
import { Role } from "@prisma/client";
import { CreateRoleDTO, RoleResponse } from "./dto/role.model";
import { RoleValidation } from "./role.validation";

@Injectable()
export class RoleService {
    constructor(
        private readonly roleRepository: RoleRepository,
        private validationService: ValidationService
    ) {}

    toRoleResponse(role: Role): RoleResponse {
        return {
            id: role.id,
            nama_role: role.nama_role
        }
    }
    
    async roleMustExists(
        id: number
    ): Promise<RoleResponse> {
        const role = await this.roleRepository.findOne(id);
        if(!role){
            throw new HttpException('not found role', 404);
        }

        return this.toRoleResponse(role);
    }
    
    async create(
        request: CreateRoleDTO,
    ): Promise<RoleResponse>{
        const requestCreate = this.validationService.validate(RoleValidation.CREATE, request);
        const cekNamaRole = await this.roleRepository.countByName(requestCreate.nama_role);
        
        if(cekNamaRole != 0){
            throw new HttpException('Role Name has already exists', 400)
        }

        const role = await this.roleRepository.createRole(requestCreate);

        return this.toRoleResponse(role);
    }

    async update(
        request: CreateRoleDTO,
        id: number
    ): Promise<RoleResponse>{
        const roleBefore = await this.roleMustExists(id);
        const requestUpdate = this.validationService.validate(RoleValidation.CREATE, request);
        if (requestUpdate.nama_role == roleBefore.nama_role){
            throw new HttpException('nothing change from before', 400);
        }

        const cekNamaRole = await this.roleRepository.countByName(requestUpdate.nama_role);
        if (cekNamaRole != 0){
            throw new HttpException('Role name has already exists', 400)
        }

        const updateRole = await this.roleRepository.updateRole(requestUpdate, roleBefore.id);

        return this.toRoleResponse(updateRole);
    }

    async remove(
        id: number
    ): Promise<RoleResponse>{
        const roleBefore = await this.roleMustExists(id);
        const role = await this.roleRepository.removeRole(roleBefore.id);

        return this.toRoleResponse(role);
    }

    async list(): Promise<RoleResponse[]> {
        const roles = await this.roleRepository.findAll();

        return roles.map((role) => this.toRoleResponse(role))
    }

    async get(
        id: number
    ): Promise<RoleResponse>{
        const role = await this.roleMustExists(id);

        return this.toRoleResponse(role);
    }
}