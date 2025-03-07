import { HttpException, Injectable } from "@nestjs/common";
import { StokRepository } from "./repository/stok-repository";
import { StokPayloadCreateMany, StokResponse, TypeStok } from "./dto/stok.model";
import { Stok } from "@prisma/client";

@Injectable()
export class StokService {
    constructor(
        private readonly stokRepository: StokRepository
    ) {}

    toStokResponse(stok: StokResponse): StokResponse {
        return {
            id: stok.id,
            batch: stok.batch,
            type: stok.type,
            qty: stok.qty,
            keterangan: stok.keterangan,
            tanggal: stok.tanggal
        }
    }

    async createStok(
        data: Omit<Stok, 'id'>
    ): Promise<StokResponse> {
        const newStok = await this.stokRepository.createStok(data);

        return this.toStokResponse(newStok);
    }

    async createManyStok(
        data: Omit<Stok, 'id'>[]
    ): Promise<StokPayloadCreateMany> {
        const newData = await this.stokRepository.createManyStok(data);
        if(newData.count != data.length) {
            throw new HttpException('Something error in create data', 500)
        }

        return newData;
    }

    async listByType(
        take: number,
        skip: number,
        type: TypeStok
    ): Promise<StokResponse[]> {
        const listData = await this.stokRepository.list(take, skip, type);

        return listData.map((item) => this.toStokResponse(item));
    }

    async countByStok(
        type: TypeStok
    ): Promise<number> {
        return await this.stokRepository.countByType(type);
    }
}