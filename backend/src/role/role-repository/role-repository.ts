import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { Role } from "@prisma/client";

@Injectable()
export class RoleRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async findAll(): Promise<Role[]> {
        return await this.prismaService.role.findMany();
    }

    async findOne(
        id: number
    ): Promise<Role> {
        return await this.prismaService.role.findUnique({
            where: {
                id: id
            }
        });
    }

    async findByName(
        nama_role: string
    ): Promise<Role[]> {
        return await this.prismaService.role.findMany({
            where: {
                nama_role: nama_role
            }
        });
    }
    
    async countByName(
        nama_role: string
    ): Promise<number>{
        return await this.prismaService.role.count({
            where: {
                nama_role: nama_role
            }
        });
    }
    
    async createRole(
        data: Omit<Role, 'id'>
    ): Promise<Role> {
        return await this.prismaService.role.create({
            data: data
        });
    }

    async updateRole(
        data: Omit<Role, 'id'>,
        id: number
    ): Promise<Role> {
        return await this.prismaService.role.update({
            where: {
                id: id
            },
            data: data
        })
    }

    async removeRole(
        id: number
    ): Promise<Role> {
        return await this.prismaService.role.delete({
            where: {
                id: id
            }
        })
    }
}