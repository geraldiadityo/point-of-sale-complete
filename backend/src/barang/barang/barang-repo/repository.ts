import { Injectable } from "@nestjs/common";
import { Barang } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";
import { BarangResponse } from "../dto/barang.model";

@Injectable()
export class BarangRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async createBarang(
        data: Omit<Barang, 'id'>
    ): Promise<BarangResponse> {
        return await this.prismaService.barang.create({
            data: data,
            include: {
                satuan: true,
                kategori: true
            }
        });
    }

    async updateBarang(
        data: Partial<Barang>,
        id: number
    ): Promise<BarangResponse> {
        return await this.prismaService.barang.update({
            where: {
                id: id
            },
            data: data,
            include: {
                satuan: true,
                kategori: true
            }
        });
    }

    async remove(
        id: number
    ): Promise<BarangResponse> {
        return await this.prismaService.barang.delete({
            where: {
                id: id
            },
            include: {
                satuan: true,
                kategori: true
            }
        });
    }

    async countByName(
        nama_barang: string
    ): Promise<number> {
        return await this.prismaService.barang.count({
            where: {
                nama_barang: nama_barang
            }
        });
    }

    async countBykode(
        kode_barang: string
    ): Promise<number>{
        return await this.prismaService.barang.count({
            where: {
                kode_barang: kode_barang
            }
        });
    }

    async countAll(): Promise<number>{
        return await this.prismaService.barang.count()
    };

    async searchBarang(
        keyword: string
    ): Promise<BarangResponse[]>{
        return await this.prismaService.barang.findMany({
            where: {
                OR: [
                    {
                        nama_barang: {
                            contains: keyword,
                            mode: 'insensitive'
                        },
                    },
                ],
            },
            include: {
                satuan: true,
                kategori: true
            }
        });
    }

    async findAll(
        take: number,
        skip: number
    ): Promise<BarangResponse[]> {
        return await this.prismaService.barang.findMany({
            include: {
                satuan: true,
                kategori: true,
            },
            take: take,
            skip: skip,
            orderBy: {
                id: 'asc'
            }
        });
    }

    async findOne(
        id: number
    ): Promise<BarangResponse>{
        return await this.prismaService.barang.findUnique({
            where: {
                id: id
            },
            include: {
                satuan: true,
                kategori: true
            }
        });
    }
}