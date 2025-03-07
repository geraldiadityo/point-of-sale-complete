import { HttpException, Injectable } from "@nestjs/common";
import { Batch } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";
import { BatchBarangCreateManyPayload } from "../dto/batch.model";


@Injectable()
export class BatchRepository {
    constructor(
        private prismaService: PrismaService
    ) {}
    
    async createBatch(
        data: Omit<Batch, 'status'>
    ): Promise<Batch> {
        return await this.prismaService.batch.create({
            data: data,
        });
    }

    async createManyBatch(
        data: Omit<Batch,'status'>[]
    ): Promise<BatchBarangCreateManyPayload> {
        return this.prismaService.$transaction(async (prisma) => {
            try {
                const result = await prisma.batch.createMany({
                    data: data,
                    skipDuplicates: true
                });

                return {
                    count: result.count
                }
            } catch (err: any){
                throw new HttpException(`Create Transaksi Batch gagal: ${err.message}`, 500)
            }
        });
    }

    async listByIdBarang(
        idBarang: number
    ): Promise<Batch[]> {
        return await this.prismaService.batch.findMany({
            where: {
                AND: [
                    {
                        barangId: idBarang
                    },
                    {
                        status: true
                    }
                ]
            },
        });
    }

    async findOneByNomor(
        nomor: string
    ): Promise<Batch> {
        return await this.prismaService.batch.findUnique({
            where: {
                nomor: nomor
            }
        })
    }

    async deleteBatch(
        nomor: string
    ): Promise<Batch> {
        return await this.prismaService.batch.delete({
            where: {
                nomor: nomor
            }
        })
    }


    async updateStok(
        nomor: string,
        stok: number
    ): Promise<Batch> {
        return await this.prismaService.batch.update({
            where: {
                nomor: nomor
            },
            data: {
                stok: stok
            }
        })
    }

    async updateAfterTransaksi(
        nomor: string,
        stok: number,
        harga_beli: number,
        harga_jual: number
    ): Promise<Batch> {
        return await this.prismaService.batch.update({
            where: {
                nomor: nomor
            },
            data: {
                stok: {
                    increment: stok
                },
                harga_beli: harga_beli,
                harga_jual: harga_jual
            }
        })
    }

    async decrementStok(
        nomor: string,
        stok: number
    ): Promise<Batch> {
        return await this.prismaService.batch.update({
            where: {
                nomor: nomor
            },
            data: {
                stok: {
                    decrement: stok
                }
            }
        });
    }

    async updateStatusFalse (
        nomor: string
    ): Promise<Batch>{
        return await this.prismaService.batch.update({
            where: {
                nomor: nomor
            },
            data: {
                status: false
            }
        });
    }

    async updateStatusTrue(
        nomor: string
    ): Promise<Batch>{
        return await this.prismaService.batch.update({
            where: {
                nomor: nomor
            },
            data: {
                status: true
            }
        });
    }

    async itemExpired(): Promise<Batch[]> {
        return await this.prismaService.batch.findMany({
            where: {
                expirate_date: {
                    lte: new Date()
                }
            }
        });
    }

}