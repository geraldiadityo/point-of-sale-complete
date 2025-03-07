import { Module } from "@nestjs/common";
import { SupplierRepository } from "./repository/supplier-repository";
import { SupplierService } from "./supplier.service";
import { SupplierContoller } from "./supplier.controller";

@Module({
    providers: [SupplierRepository, SupplierService],
    controllers: [SupplierContoller],
    exports: [SupplierService]
})
export class SupplierModule {}