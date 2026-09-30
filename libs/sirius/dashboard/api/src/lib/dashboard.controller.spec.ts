import { Test } from '@nestjs/testing';
import { DashboardApiModule } from './dashboard.module';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  it('resolves its domain service through Nest injection', async () => {
    const module = await Test.createTestingModule({
      imports: [DashboardApiModule],
    }).compile();
    try {
      const result = module.get(DashboardController).getSummary();

      expect(result).toEqual({
        message: 'Welcome to Sirius',
      });
    } finally {
      await module.close();
    }
  });
});
