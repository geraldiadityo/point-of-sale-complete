import { TestingModule, Test } from "@nestjs/testing";
import { RoleService } from "../role.service"
import { ValidationService } from "../../common/validation.service";
import { RoleRepository } from "../role-repository/role-repository";
import { PrismaService } from "../../common/prisma.service";
import * as winston from 'winston';

const prismaMock = {
    role: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        delete: jest.fn()
    }
}

describe('Role Service', () => {
    let service: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RoleService,
                ValidationService,
                RoleRepository,
                {
                    provide: PrismaService,
                    useValue: prismaMock
                },
                {
                    provide: 'winston',
                    useValue: winston
                }
            ],
        })
        .compile();

        service = module.get<RoleService>(RoleService);

        prismaMock.role.create.mockClear();
        prismaMock.role.update.mockClear();
        prismaMock.role.findMany.mockClear();
        prismaMock.role.findUnique.mockClear();
        prismaMock.role.count.mockClear();
        prismaMock.role.delete.mockClear();

    });

    describe('Create Role', () => {
        it('should be create new role', async () => {
            const mockData = {
                id: 1,
                nama_role: 'Admin'
            };

            const request = {
                nama_role: 'Admin'
            }

            prismaMock.role.count.mockResolvedValue(0);
            prismaMock.role.create.mockResolvedValue(mockData);

            const result = await service.create(request);

            expect(result).toEqual(mockData);
            expect(prismaMock.role.count).toHaveBeenCalledWith({ where: { nama_role: request.nama_role } });
            expect(prismaMock.role.create).toHaveBeenCalledWith({ data: request });
        })
    });
    
    describe('Update role', () => {
        it('should be updated role', async () => {
            const id = 1;
            const dataBefore = {
                id: 1,
                nama_role: 'Admin'
            }
            const requestUpdate = {
                nama_role: 'Superadmin'
            };

            const mockData = {
                id: 1,
                nama_role: 'Superadmin'
            };

            prismaMock.role.findUnique.mockResolvedValue(dataBefore);
            prismaMock.role.count.mockResolvedValue(0);
            prismaMock.role.update.mockResolvedValue(mockData);
            
            const result = await service.update(requestUpdate, dataBefore.id);

            expect(result).toEqual(mockData);
            expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where: { id: id } });
            expect(prismaMock.role.count).toHaveBeenCalledWith({ where: { nama_role: requestUpdate.nama_role } });
            expect(prismaMock.role.update).toHaveBeenCalledWith({ where: { id: dataBefore.id }, data: requestUpdate });
        });
    });

    describe('Get role', () => {
        it('should be get list role', async () => {
            const mockData = [
                { id: 1, nama_role: 'Admin' },
                { id: 2, nama_role: 'Kasir' },
            ];
            prismaMock.role.findMany.mockResolvedValue(mockData);
            
            const result = await service.list();
            expect(result).toEqual(mockData);
        });

        it('should be get role with id', async () => {
            const id = 1;
            const mockData = {
                id: 1,
                nama_role: 'Admin'
            }

            prismaMock.role.findUnique.mockResolvedValue(mockData);
            const result = await service.get(id);

            expect(result).toEqual(mockData);
            expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where: { id: id } });
        });
    });

    describe('Delete Role', () => {
        it('should be delete role', async () => {
            const id = 1;
            const mockData = {
                id: 1,
                nama_role: 'Admin'
            }

            prismaMock.role.findUnique.mockResolvedValue(mockData);
            prismaMock.role.delete.mockResolvedValue(mockData);
            
            const result = await service.remove(mockData.id);
            
            expect(result).toEqual(mockData);
            expect(prismaMock.role.findUnique).toHaveBeenCalledWith({ where: { id: id } });
            expect(prismaMock.role.delete).toHaveBeenCalledWith({ where: { id: mockData.id } });
        });
    });
})