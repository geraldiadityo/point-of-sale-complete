import { HttpException, Injectable } from "@nestjs/common";
import { PenggunaRepository } from "../pengguna/pengguna-repository/pengguna-repository";
import { ValidationService } from "../common/validation.service";
import { JwtService } from "@nestjs/jwt";
import { PenggunaService } from "../pengguna/pengguna.service";
import { LoginRequestDTO, LoginResponse } from "./dto/auth.model";
import { PenggunaResponse } from "../pengguna/dto/pengguna.model";
import { AuthValidation } from "./auth.validation";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly penggunaRepo: PenggunaRepository,
        private penggunaService: PenggunaService,
        private validationService: ValidationService,
        private jwtService: JwtService
    ){}

    async validate(
        request: LoginRequestDTO
    ): Promise<PenggunaResponse> {
        const loginRequest = this.validationService.validate(AuthValidation.LOGIN, request);
        const user = await this.penggunaRepo.findOneWithPassword(loginRequest.username);

        if(!user){
            throw new HttpException('Username or password is invalid', 401);
        }

        if(!(user && bcrypt.compareSync(loginRequest.password, user.password))){
            throw new HttpException('Username or password is invalid', 401);
        }

        const validatedUser = await this.penggunaRepo.findOne(user.username);

        return validatedUser;
    }

    async login(
        user: PenggunaResponse
    ): Promise<LoginResponse> {
        const payload = { username: user.username, sub: user.pegawai.id };

        return {
            token: this.jwtService.sign(payload)
        }
    }
}