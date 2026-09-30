import { Controller, Get } from '@nestjs/common';
import { DashboardService } from '@celestial/sirius/dashboard/domain';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get()
  getSummary() {
    return this.dashboard.getSummary();
  }
}
