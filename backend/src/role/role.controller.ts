import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { RoleService } from "./role.service";
import { CreateRoleDTO, RoleResponse } from "./dto/role.model";
import { WebModel } from "../model/web.model";
import { RoleGuard } from "src/common/role.guard";
import { Roles } from "src/common/role.decorator";

@UseGuards(RoleGuard)
@Controller('/api/role')
export class RoleController {
    constructor(
        private roleService: RoleService
    ) {}

    @Roles('Admin')
    @Post('/create-role')
    @HttpCode(201)
    async create(
        @Body() request: CreateRoleDTO
    ): Promise<WebModel<RoleResponse>> {
        const result = await this.roleService.create(request);
        
        return {
            data: result,
            message: `create role with name: ${result.nama_role} was successfully`
        }
    }
    
    @Roles('Admin')
    @Put('/update-role/:id')
    @HttpCode(200)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() request: CreateRoleDTO
    ): Promise<WebModel<RoleResponse>> {
        const result = await this.roleService.update(request, id);
        
        return {
            data: result,
            message: `update role with new name: ${result.nama_role} was successfully`
        }
    }

    @Roles('Admin')
    @Delete('/delete-role/:id')
    @HttpCode(200)
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<boolean>>{
        const result = await this.roleService.remove(id);

        return {
            data: true,
            message: `delete role with name: ${result.nama_role} was successfully`
        }
    }

    @Roles('Admin')
    @Get('/view')
    @HttpCode(200)
    async list(): Promise<WebModel<RoleResponse[]>> {
        const result = await this.roleService.list();


        return {
            data: result,
        }
    }

    @Roles('Admin')
    @Get('/view/:id')
    @HttpCode(200)
    async get(
        @Param('id', ParseIntPipe) id: number
    ): Promise<WebModel<RoleResponse>>{
        const result = await this.roleService.get(id);

        return {
            data: result,
            message: 'found it!'
        }
    }
}
