import { Global, MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { WinstonModule } from "nest-winston";
import * as winston from 'winston';
import { PrismaService } from "./prisma.service";
import { ValidationService } from "./validation.service";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ErrorFilter } from "./error.filter";
import { AuthMiddleware } from "./auth.middleware";
import { ScheduleModule } from "@nestjs/schedule";
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
        }]),
        ScheduleModule.forRoot(),
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

// export class CommonModule {}

export class CommonModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthMiddleware).exclude({
            path: '/api/auth',
            method: RequestMethod.POST
        })
        .forRoutes({
            path:'/api/*',
            method: RequestMethod.ALL
        });
    }
}