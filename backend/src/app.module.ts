import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    CommonModule,
    RoleModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
