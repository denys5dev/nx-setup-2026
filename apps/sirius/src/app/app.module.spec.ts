import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';

describe('AppModule', () => {
  it('composes the dashboard dependencies', async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    try {
      const result = await module.init();

      expect(result).toBe(module);
    } finally {
      await module.close();
    }
  });
});
