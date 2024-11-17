import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { Pegawai } from "@prisma/client";

@Injectable()
export class PegawaiRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async createPegawai(
        data: Omit<Pegawai, 'id'>
    ): Promise<Pegawai> {
        return await this.prismaService.pegawai.create({
            data: data
        });
    }

    async updatePegawai(
        data: Partial<Pegawai>,
        id: number
    ): Promise<Pegawai> {
        return await this.prismaService.pegawai.update({
            where: {
                id: id
            },
            data: data
        })
    }

    async findAll(
        skip: number,
        take: number
    ): Promise<Pegawai[]> {
        return await this.prismaService.pegawai.findMany({
            skip: skip,
            take: take
        });
    }

    async findOne(
        id: number
    ): Promise<Pegawai> {
        return await this.prismaService.pegawai.findUnique({
            where: {
                id: id
            }
        });
    }

    async search(
        keyword: string
    ): Promise<Pegawai[]> {
        return await this.prismaService.pegawai.findMany({
            where: {
                OR: [
                    {
                        nk: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },
                    {
                        nik: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },
                    {
                        nama_lengkap: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });
    }

    async remove(
        id: number
    ): Promise<Pegawai> {
        return await this.prismaService.pegawai.delete({
            where: {
                id: id
            }
        });
    }

    async countAll(): Promise<number> {
        return await this.prismaService.pegawai.count();
    }

    async findByNik(
        nik: string
    ): Promise<Pegawai> {
        return await this.prismaService.pegawai.findFirst({
            where: {
                nik: nik
            }
        });
    }

    async findNikExclude(
        nik: string,
        exclude: string
    ): Promise<Pegawai> {
        return await this.prismaService.pegawai.findFirst({
            where: {
                nik: nik,
                NOT: {
                    nik: exclude
                }
            }
        })
    }

    async lastRecord(): Promise<Pegawai> {
        return await this.prismaService.pegawai.findFirst({
            orderBy: {
                id: 'desc'
            }
        });
    }


}