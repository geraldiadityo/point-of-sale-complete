import { Module } from "@nestjs/common";
import { RoleService } from "./role.service";
import { RoleRepository } from "./role-repository/role-repository";
import { RoleController } from "./role.controller";

@Module({
    providers: [RoleService, RoleRepository],
    controllers: [RoleController],
    exports: [RoleService]
})
export class RoleModule {}