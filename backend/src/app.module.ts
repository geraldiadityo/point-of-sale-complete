import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PegawaiModule } from './pegawai/pegawai.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CommonModule,
    RoleModule,
    PegawaiModule,
    PenggunaModule,
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
