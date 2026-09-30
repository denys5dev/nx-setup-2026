import { Module } from '@nestjs/common';
import { DashboardDomainModule } from '@celestial/sirius/dashboard/domain';
import { TodoController } from './todo.controller';
import { DashboardController } from './dashboard.controller';

@Module({
  imports: [DashboardDomainModule],
  controllers: [DashboardController, TodoController],
})
export class DashboardApiModule {}
