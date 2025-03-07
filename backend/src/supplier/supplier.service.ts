import { HttpException, Injectable } from "@nestjs/common";
import { SupplierRepository } from "./repository/supplier-repository";
import { ValidationService } from "src/common/validation.service";
import { Supplier } from "@prisma/client";
import { SupplierCreateDTO, SupplierResponse } from "./dto/supplier.model";
import { SupplierValidation } from "./supplier.validation";

@Injectable()
export class SupplierService {
    constructor(
        private readonly supplierRepository: SupplierRepository,
        private validationService: ValidationService
    ) {}

    toSupplierResponse(supplier: Supplier): SupplierResponse {
        return {
            id: supplier.id,
            nama_supplier: supplier.nama_supplier,
            nomor_telp: supplier.nomor_telp,
            alamat: supplier.alamat,
            deskripsi: supplier.deskripsi
        }
    }

    async supplierMustBeExists(
        id: number
    ): Promise<SupplierResponse> {
        const supplier = await this.supplierRepository.findOne(id);
        if(!supplier){
            throw new HttpException('Supplier not found!', 404);
        }

        return this.toSupplierResponse(supplier);
    }

    async checkByName(
        nama_supplier: string
    ): Promise<void> {
        const checkName = await this.supplierRepository.countByName(nama_supplier);
        if (checkName != 0){
            throw new HttpException('Nama Supplier has already taken', 404);
        }
    }

    async countall(): Promise<number> {
        return await this.supplierRepository.countAll();
    }

    async create(
        request: SupplierCreateDTO
    ): Promise<SupplierResponse> {
        const requestCreate = this.validationService.validate(SupplierValidation.CREATE, request);
        await this.checkByName(requestCreate.nama_supplier);
        const newSupplier = await this.supplierRepository.createSupplier(requestCreate);

        return this.toSupplierResponse(newSupplier);
    }

    async update(
        id: number,
        request: SupplierCreateDTO
    ): Promise<SupplierResponse> {
        const oldSupplier = await this.supplierMustBeExists(id);
        const requestUpdate = this.validationService.validate(SupplierValidation.CREATE, request);
        if(requestUpdate.nama_supplier != oldSupplier.nama_supplier){
            await this.checkByName(requestUpdate.nama_supplier);
        }

        const updateSupplier = await this.supplierRepository.updateSupplier(oldSupplier.id, requestUpdate);

        return this.toSupplierResponse(updateSupplier);

    }

    async remove(
        id: number
    ): Promise<SupplierResponse> {
        const oldSupplier = await this.supplierMustBeExists(id);

        const deleteSupplier = await this.supplierRepository.removeSupplier(oldSupplier.id);

        return this.toSupplierResponse(deleteSupplier);
    }
    
    async search(
        keyword: string
    ): Promise<SupplierResponse[]> {
        const listSearch = await this.supplierRepository.search(keyword);

        // if(listSearch.length == 0){
        //     throw new HttpException('search result not found!', 404);
        // }

        return listSearch.map((item) => this.toSupplierResponse(item))
    }

    async list(
        take: number,
        skip: number
    ): Promise<SupplierResponse[]> {
        const listSupplier = await this.supplierRepository.findAll(take, skip);

        return listSupplier.map((item) => this.toSupplierResponse(item));
    }

}