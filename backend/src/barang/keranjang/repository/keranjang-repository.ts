import { Injectable } from "@nestjs/common";
import { Keranjang } from "@prisma/client";
import { PrismaService } from "src/common/prisma.service";
import { KeranjangPayload, KeranjangResponseEx } from "../dto/keranjang.model";

@Injectable()
export class KeranjangRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async insertKeranjang(
        data: Omit<Keranjang, 'id'>[]
    ): Promise<KeranjangPayload> {
        return await this.prismaService.keranjang.createMany({
            data: data
        });
    }

    async listByIdTransaksi(
        transaksiId: number
    ): Promise<KeranjangResponseEx[]> {
        return await this.prismaService.keranjang.findMany({
            where: {
                transaksiId: transaksiId
            },
            select: {
                id: true,
                transaksiId: true,
                nomor_batch: true,
                barang: {
                    select: {
                        id: true,
                        kode_barang: true,
                        nama_barang: true
                    }
                },
                qty: true,
                harga_beli: true,
                harga_jual: true,
                total_harga: true,
                expired_date: true,
                tanggal: true
            }
        })
    };

    async getItemKeranjangById(
        id: number
    ): Promise<Keranjang> {
        return await this.prismaService.keranjang.findUnique({
            where: {
                id: id
            }
        })
    }

    async remove(
        id: number
    ): Promise<Keranjang> {
        return await this.prismaService.keranjang.delete({
            where: {
                id: id
            }
        })
    }

    async editQty(
        id: number,
        qty: number
    ): Promise<Keranjang> {
        return await this.prismaService.keranjang.update({
            where: {
                id: id
            },
            data: {
                qty: qty
            }
        });
    }
}