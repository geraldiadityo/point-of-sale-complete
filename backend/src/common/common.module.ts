import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { WinstonModule } from "nest-winston";
import * as winston from 'winston';
import { PrismaService } from "./prisma.service";
import { ValidationService } from "./validation.service";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ErrorFilter } from "./error.filter";
@Global()
@Module({
    imports: [
        WinstonModule.forRoot({
            level: 'debug',
            format: winston.format.json(),
            transports: [
                new winston.transports.Console()
            ]
        }),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([{
            ttl: 6000,
            limit: 10
        }])
    ],
    providers: [
        PrismaService,
        ValidationService,
        {
            provide: APP_FILTER,
            useClass: ErrorFilter
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        }
    ],
    exports: [
        PrismaService,
        ValidationService
    ]
})
export class CommonModule {}