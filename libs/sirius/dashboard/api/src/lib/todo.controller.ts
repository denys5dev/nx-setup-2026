import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DashboardService } from '@celestial/sirius/dashboard/domain';
import { parseCreateTodo, parseUpdateTodo } from './todo.dto';

@Controller('dashboard/todos')
export class TodoController {
  constructor(private readonly dashboard: DashboardService) {}

  @Get()
  list() {
    return this.dashboard.listTodos();
  }

  @Get(':id')
  get(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.dashboard.getTodo(id);
  }

  @Post()
  create(@Body() body: unknown) {
    return this.dashboard.createTodo(parseCreateTodo(body));
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() body: unknown,
  ) {
    return this.dashboard.updateTodo(id, parseUpdateTodo(body));
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string): void {
    this.dashboard.deleteTodo(id);
  }
}
