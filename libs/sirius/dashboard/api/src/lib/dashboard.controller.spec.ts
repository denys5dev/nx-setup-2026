import { Test } from '@nestjs/testing';
import { DashboardApiModule } from './dashboard.module';
import { DashboardController } from './dashboard.controller';

describe('DashboardController', () => {
  it('when getSummary is called on the injected controller, should return the domain service summary', async () => {
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
