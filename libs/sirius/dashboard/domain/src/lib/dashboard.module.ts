import { Module } from '@nestjs/common';
import { DashboardService } from './application/dashboard.service';
import { TodoRepository } from './infrastructure/todo.repository';

@Module({
  providers: [DashboardService, TodoRepository],
  exports: [DashboardService],
})
export class DashboardDomainModule {}
