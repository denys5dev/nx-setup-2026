import { Module } from '@nestjs/common';
import { SiriusShellModule } from '@celestial/sirius/shell';

@Module({ imports: [SiriusShellModule] })
export class AppModule {}
