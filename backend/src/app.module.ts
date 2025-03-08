import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';
import { PegawaiModule } from './pegawai/pegawai.module';
import { PenggunaModule } from './pengguna/pengguna.module';
import { AuthModule } from './auth/auth.module';
import { KategoriModule } from './barang/kategori/kategori.module';
import { SatuanModule } from './barang/satuan/satuan.module';
import { BarangModule } from './barang/barang/barang.module';
import { SupplierModule } from './supplier/supplier.module';
import { BatchModule } from './barang/batch/batch.module';
import { TransaksiModule } from './barang/transaksi/transaksi.module';
import { KeranjangModule } from './barang/keranjang/keranjang.module';
import { StokModule } from './barang/stok/stok.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    CommonModule,
    DashboardModule,
    RoleModule,
    PegawaiModule,
    PenggunaModule,
    AuthModule,
    KategoriModule,
    SatuanModule,
    BarangModule,
    SupplierModule,
    BatchModule,
    TransaksiModule,
    KeranjangModule,
    StokModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
