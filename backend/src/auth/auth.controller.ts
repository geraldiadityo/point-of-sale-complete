import { Body, Controller, HttpCode, HttpException, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDTO } from "./dto/auth.model";
import { WebModel } from "src/model/web.model";
import { PenggunaResponse } from "src/pengguna/dto/pengguna.model";
import { Throttle } from "@nestjs/throttler";

@Controller('/api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) {}

    @Throttle({ default: { limit: 3, ttl: 5000 } })
    @Post()
    @HttpCode(200)
    async login(
        @Body() request: LoginRequestDTO
    ): Promise<WebModel<PenggunaResponse>> {
        const user = await this.authService.validate(request);
        if (!user) {
            throw new HttpException('Invalid credential', 401);
        }

        const token = await this.authService.login(user);

        return {
            data: user,
            token: token.token,
        }
    }
}