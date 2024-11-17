import { HttpException, Inject, NestMiddleware } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from './prisma.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

export class AuthMiddleware implements NestMiddleware {
    constructor(
        private prismaService: PrismaService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    ) {}

    async use(req: any, res: any, next: (error?: Error | any) => void) {
        const token: string = req.headers['authorization']?.split(' ')[1];

        if(!token){
            throw new HttpException('Unauthorization', 401);
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as { username: string };

            const user = await this.prismaService.pengguna.findUnique({
                where: {
                    username: decoded.username as string
                },
                select: {
                    username: true,
                    pegawai: {
                        select: {
                            id: true,
                            nama_lengkap: true,
                            nk: true,
                            nik: true,
                        },
                    },
                    role: {
                        select: {
                            id: true,
                            nama_role: true
                        }
                    },
                    status: true
                }
            });

            req.user = user;
            this.logger.info(user)

            next();
        } catch (err: any){
            throw new HttpException(err, 401)
        }
    }
}