import { Injectable } from "@nestjs/common";
import { Satuan_barang } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class SatuanRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async createSatuan(
        data: Omit<Satuan_barang, 'id'>
    ): Promise<Satuan_barang>{
        return await this.prismaService.satuan_barang.create({
            data: data
        });
    }

    async updateSatuan(
        data: Partial<Satuan_barang>,
        id: number
    ): Promise<Satuan_barang>{
        return await this.prismaService.satuan_barang.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async findAll(): Promise<Satuan_barang[]>{
        return await this.prismaService.satuan_barang.findMany();
    }

    async findOne(
        id: number
    ): Promise<Satuan_barang>{
        return await this.prismaService.satuan_barang.findUnique({
            where: {
                id: id
            }
        });
    }

    async remove(
        id: number
    ): Promise<Satuan_barang>{
        return await this.prismaService.satuan_barang.delete({
            where: {
                id: id
            }
        });
    }
}