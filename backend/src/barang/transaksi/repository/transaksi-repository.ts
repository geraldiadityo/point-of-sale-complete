import { HttpException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma.service";
import { CreateTransaksiDTO, Detail_TransaksiDTO, DetailTransaksiPayload, DetailTransaksiResponse, TransaksiResponse, UpdateAfterCreateDetail } from "../dto/transaksi.model";




@Injectable()
export class TransaksiRepository {
    constructor(
        private prismaService: PrismaService
    ) {}

    async listTransaksi(
        take: number,
        skip: number
    ): Promise<TransaksiResponse[]> {
        return await this.prismaService.transaksi.findMany({
            where: {
                deleted_at: null
            },
            take: take,
            skip: skip,
            orderBy: {
                tanggal_faktur: 'desc'
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async listTransaksiByStatusFinal(
        take: number,
        skip: number,
        final: boolean
    ): Promise<TransaksiResponse[]> {
        return await this.prismaService.transaksi.findMany({
            where: {
                deleted_at: null,
                status: final
            },
            take: take,
            skip: skip,
            orderBy: {
                tanggal_faktur: 'desc'
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        })
    }

    async listTransaksiByStatus(
        take: number,
        skip: number,
        status: boolean
    ): Promise<TransaksiResponse[]> {
        return await this.prismaService.transaksi.findMany({
            where: {
                deleted_at: null,
                status_bayar: status
            },
            take: take,
            skip: skip,
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            },
            orderBy: {
                tanggal_faktur: 'desc'
            }
        });
    }

    async listTransaksiCancel(
        take: number,
        skip: number
    ): Promise<TransaksiResponse[]> {
        return await this.prismaService.transaksi.findMany({
            where: {
                deleted_at: {
                    not: null
                }
            },
            take: take,
            skip: skip,
            orderBy: {
                tanggal_faktur: 'asc'
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async searchTransaksi(
        keyword: string,
        take: number,
        skip: number,
    ): Promise<TransaksiResponse[]> {
        return await this.prismaService.transaksi.findMany({
            where: {
                OR: [
                    {
                        nomor_faktur: {
                            contains: keyword,
                            mode: 'insensitive'
                        }
                    }
                ]
            },
            orderBy: {
                tanggal_faktur: 'desc'
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            },
            take: take,
            skip: skip
        });
    }

    async findOne(
        id: number
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async createTransaksi(
        data: CreateTransaksiDTO
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.create({
            data:{
                nomor_faktur: data.nomor_faktur,
                supplierId: data.supplierId,
                tanggal_faktur: data.tanggal_faktur,
                tanggal_terima: data.tanggal_terima,
                tanggal_jatuh_tempo: data.tanggal_jatuh_tempo,
                total_bayar: data.total_bayar,
                keterangan: data.keterangan,
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async createDetailTransaksi(
        data: Detail_TransaksiDTO[]
    ): Promise<DetailTransaksiPayload> {
        return this.prismaService.$transaction(async (prisma) => {
            try {
                const result = await prisma.detail_transaksi.createMany({
                    data: data,
                    skipDuplicates: true
                });

                return {
                    count: result.count
                }
            } catch (err: any){
                throw new HttpException(`Transaction detail transaksi failed`, 500);
            }
        });
    }

    async updateAfterDetail(
        transaksiId: number,
        data: UpdateAfterCreateDetail
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.update({
            where: {
                id: transaksiId,
            },
            data: data,
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async findByNomor(
        nomor_faktur: string
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.findUnique({
            where: {
                nomor_faktur: nomor_faktur
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async countAll(): Promise<number>{
        return await this.prismaService.transaksi.count();
    }

    async countAllByStatus(
        status: boolean
    ): Promise<number> {
        return await this.prismaService.transaksi.count({
            where: {
                deleted_at: null,
                status_bayar: status
            }
        });
    }

    async countAllByFinal(
        status: boolean
    ): Promise<number> {
        return await this.prismaService.transaksi.count({
            where: {
                deleted_at: null,
                status: status
            }
        });
    }

    async countAllCanceled(): Promise<number> {
        return await this.prismaService.transaksi.count({
            where: {
                deleted_at: {
                    not: null
                }
            }
        });
    }

    async detailByIdTransaction(
        transaksiId: number
    ): Promise<DetailTransaksiResponse[]> {
        return await this.prismaService.detail_transaksi.findMany({
            where: {
                transaksiId: transaksiId
            },
            select: {
                id: true,
                transaksiId: true,
                barang: {
                    select: {
                        id: true,
                        kode_barang: true,
                        nama_barang: true
                    }
                },
                batch: {
                    select: {
                        nomor: true,
                        stok: true,
                        expirate_date: true
                    }
                },
                qty: true,
                expirate_date: true,
                harga_beli: true,
                harga_jual: true,
                tanggal: true
            }
        });
    }

    async changeStatusBayar(
        idTransaksi: number
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.update({
            where: {
                id: idTransaksi
            },
            data: {
                status_bayar: true
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async changeStatusFinal(
        idTransaksi: number
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.update({
            where: {
                id: idTransaksi
            },
            data: {
                status: true
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }

    async flagedTransaksi(
        id: number
    ): Promise<TransaksiResponse> {
        return await this.prismaService.transaksi.update({
            where: {
                id: id
            },
            data: {
                deleted_at: new Date()
            },
            select: {
                id: true,
                nomor_faktur: true,
                tanggal_faktur: true,
                tanggal_terima: true,
                tanggal_jatuh_tempo: true,
                supplier: true,
                status_bayar: true,
                total_bayar: true,
                status: true,
            }
        });
    }
}