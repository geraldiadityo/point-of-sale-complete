import { Injectable } from "@nestjs/common";
import { Supplier } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";

@Injectable()
export class SupplierRepository {
    constructor(
        private prismaService: PrismaService
    ) {}
    
    async createSupplier(
        data: Omit<Supplier, 'id'>
    ): Promise<Supplier> {
        return await this.prismaService.supplier.create({
            data: data
        });
    }

    async updateSupplier(
        id: number,
        data: Partial<Supplier>
    ): Promise<Supplier> {
        return await this.prismaService.supplier.update({
            where: {
                id: id
            },
            data: data
        });
    }

    async removeSupplier(
        id: number
    ): Promise<Supplier> {
        return await this.prismaService.supplier.delete({
            where: {
                id: id
            }
        });
    }

    async findAll(
        take: number,
        skip: number
    ): Promise<Supplier[]> {
        return await this.prismaService.supplier.findMany({
            take: take,
            skip: skip
        });
    }

    async findOne(
        id: number
    ): Promise<Supplier> {
        return await this.prismaService.supplier.findUnique({
            where: {
                id: id
            }
        });
    }

    async countAll(): Promise<number> {
        return await this.prismaService.supplier.count();
    }

    async countByName(
        name: string
    ): Promise<number> {
        return await this.prismaService.supplier.count({
            where: {
                nama_supplier: name
            }
        });
    }

    async search(
        keyword: string
    ): Promise<Supplier[]> {
        return await this.prismaService.supplier.findMany({
            where: {
                OR: [
                    {
                        nama_supplier: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    },
                    {
                        alamat: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        });
    }

}