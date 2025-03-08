import { Injectable } from "@nestjs/common";
import { Stok } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";
import { StokPayloadCreateMany, StokResponse, TypeStok } from "../dto/stok.model";

@Injectable()
export class StokRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async createStok(
        data: Omit<Stok, 'id'>
    ): Promise<StokResponse> {
        return await this.prismaService.stok.create({
            data: data,
            select: {
                id: true,
                batch: {
                    select: {
                        nomor: true,
                        barang: {
                            select: {
                                id: true,
                                kode_barang: true,
                                nama_barang: true,
                            },
                        }
                    },
                },
                type: true,
                qty: true,
                keterangan: true,
                tanggal: true
            }
        });
    }

    async createManyStok(
        data: Omit<Stok, 'id'>[]
    ): Promise<StokPayloadCreateMany> {
        return await this.prismaService.stok.createMany({
            data: data
        })
    }

    async list(
        take: number,
        skip: number,
        type: TypeStok
    ): Promise<StokResponse[]> {
        return await this.prismaService.stok.findMany({
            where: {
                type: type
            },
            select: {
                id: true,
                batch: {
                    select: {
                        nomor: true,
                        barang: {
                            select: {
                                id: true,
                                kode_barang: true,
                                nama_barang: true,
                            },
                        }
                    },
                },
                type: true,
                qty: true,
                keterangan: true,
                tanggal: true
            },
            take: take,
            skip: skip,
            orderBy: {
                tanggal: 'desc'
            }
        });
    }

    async countByType(
        type: TypeStok
    ): Promise<number> {
        return await this.prismaService.stok.count({
            where: {
                type: type
            }
        });
    }
}