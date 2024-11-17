import { PrismaService } from "src/common/prisma.service";
import { PenggunaCreateRequest, PenggunaResponse } from "../dto/pengguna.model";
import { Injectable } from "@nestjs/common";
import { Pengguna } from "@prisma/client";

@Injectable()
export class PenggunaRepository {
    constructor (
        private prismaService: PrismaService
    ) {}

    async createPengguna(
        data: PenggunaCreateRequest
    ): Promise<PenggunaResponse> {
        return await this.prismaService.pengguna.create({
            data: {
                username: data.username,
                password: data.password,
                pegawaiId: data.pegawaiId,
                roleId: data.roleId
            },
            include: {
                pegawai: true,
                role: true
            }
        });
    }

    async findAll(
        skip: number,
        take: number
    ): Promise<PenggunaResponse[]> {
        return await this.prismaService.pengguna.findMany({
            take: take,
            skip: skip,
            include: {
                pegawai: true,
                role: true
            }
        });
    }

    async findOne(
        username: string
    ): Promise<PenggunaResponse> {
        return await this.prismaService.pengguna.findUnique({
            where: {
                username: username
            },
            include: {
                pegawai: true,
                role: true
            }
        });
    }

    async findOneWithPassword(
        username: string
    ): Promise<Pengguna> {
        return await this.prismaService.pengguna.findUnique({
            where: {
                username: username
            },
            include: {
                pegawai: true,
                role: true
            }
        });
    }

    async countByUsername(
        username: string
    ): Promise<number> {
        return await this.prismaService.pengguna.count({
            where: {
                username: username
            }
        })
    }

    async countAll(): Promise<number> {
        return await this.prismaService.pengguna.count();
    }

    async search(
        keyword: string
    ): Promise<PenggunaResponse[]> {
        return await this.prismaService.pengguna.findMany({
            where: {
                OR: [
                    {
                        username: {
                            contains: keyword,
                            mode: 'insensitive'
                        },
                        pegawai: {
                            nama_lengkap: {
                                contains: keyword,
                                mode: 'insensitive'
                            }
                        }
                    }
                ]
            },
            include: {
                pegawai: true,
                role: true
            }
        })
    }

    async remove(
        username: string
    ): Promise<PenggunaResponse> {
        return await this.prismaService.pengguna.delete({
            where: {
                username: username
            },
            include: {
                pegawai: true,
                role: true
            }
        });
    }
}