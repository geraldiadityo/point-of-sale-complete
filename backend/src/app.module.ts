import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PegawaiModule } from './pegawai/pegawai.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { AuthModule } from './auth/auth.module';
import { KategoriModule } from './barang/kategori/kategori.module';
import { SatuanModule } from './barang/satuan/satuan.module';

@Module({
  imports: [
    CommonModule,
    RoleModule,
    PegawaiModule,
    PenggunaModule,
    AuthModule,
    KategoriModule,
    SatuanModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
