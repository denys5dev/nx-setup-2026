import { Module } from '@nestjs/common';
import { DashboardApiModule } from '@celestial/sirius/dashboard/api';

@Module({ imports: [DashboardApiModule] })
export class AppModule {}
