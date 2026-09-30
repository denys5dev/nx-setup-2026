import { BadRequestException } from '@nestjs/common';
import { TODO_TITLE_MAX_LENGTH } from '@celestial/shared/dashboard/contracts';
import type {
  CreateTodoInput,
  UpdateTodoInput,
} from '@celestial/shared/dashboard/contracts';

function bodyObject(
  value: unknown,
  allowed: string[],
): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new BadRequestException('Expected a JSON object');
  }
  if (Object.keys(value).some((key) => !allowed.includes(key))) {
    throw new BadRequestException('Unexpected todo field');
  }
  return value as Record<string, unknown>;
}

function title(value: unknown): string {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    value.trim().length > TODO_TITLE_MAX_LENGTH
  ) {
    throw new BadRequestException(
      `Title must contain 1–${TODO_TITLE_MAX_LENGTH} characters`,
    );
  }
  return value.trim();
}

export function parseCreateTodo(value: unknown): CreateTodoInput {
  const body = bodyObject(value, ['title']);
  return { title: title(body['title']) };
}

export function parseUpdateTodo(value: unknown): UpdateTodoInput {
  const body = bodyObject(value, ['title', 'completed']);
  if (Object.keys(body).length === 0) {
    throw new BadRequestException('Provide a title or completed state');
  }
  if ('completed' in body && typeof body['completed'] !== 'boolean') {
    throw new BadRequestException('Completed must be a boolean');
  }
  return {
    ...('title' in body ? { title: title(body['title']) } : {}),
    ...('completed' in body ? { completed: body['completed'] as boolean } : {}),
  };
}
