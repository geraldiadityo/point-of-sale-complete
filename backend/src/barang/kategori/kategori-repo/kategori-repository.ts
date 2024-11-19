import { Injectable } from "@nestjs/common";
import { Kategori_barang } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class KategoriRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async createKategori(
        data: Omit<Kategori_barang, 'id'>
    ): Promise<Kategori_barang> {
        return await this.prismaService.kategori_barang.create({
            data: data
        });
    }

    async updateKategori(
        data: Partial<Kategori_barang>,
        id: number
    ): Promise<Kategori_barang>{
        return await this.prismaService.kategori_barang.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async findAll(): Promise<Kategori_barang[]> {
        return await this.prismaService.kategori_barang.findMany();
    }

    async findOne(
        id: number
    ): Promise<Kategori_barang>{
        return await this.prismaService.kategori_barang.findUnique({
            where: {
                id: id
            }
        });
    }

    async remove(
        id: number
    ): Promise<Kategori_barang> {
        return await this.prismaService.kategori_barang.delete({
            where: {
                id: id
            }
        });
    }
}