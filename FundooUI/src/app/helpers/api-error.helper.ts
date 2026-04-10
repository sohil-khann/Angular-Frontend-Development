import { HttpErrorResponse } from '@angular/common/http';

function flattenValidationErrors(errors: unknown): string[] {
  if (!errors || typeof errors !== 'object') {
    return [];
  }

  return Object.values(errors)
    .flatMap((value) => (Array.isArray(value) ? value : []))
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
}

export function buildFriendlyError(error: unknown, fallbackMessage: string): Error {
  if (!(error instanceof HttpErrorResponse)) {
    return new Error(fallbackMessage);
  }

  if (error.status === 0) {
    return new Error(
      'Cannot reach the Fundoo API. Make sure the backend is running on https://localhost:7008 and try again.'
    );
  }

  const validationMessages = flattenValidationErrors(error.error?.errors);
  if (validationMessages.length) {
    return new Error(validationMessages.join(' '));
  }

  if (typeof error.error?.message === 'string' && error.error.message.trim()) {
    return new Error(error.error.message);
  }

  if (typeof error.error === 'string' && error.error.trim()) {
    return new Error(error.error);
  }

  if (error.status === 401) {
    return new Error('Your session has expired. Please login again and retry this action.');
  }

  if (error.status === 403) {
    return new Error('You do not have permission to perform this action.');
  }

  if (error.status === 404) {
    return new Error('The requested item could not be found. It may have been removed already.');
  }

  if (error.status >= 500) {
    return new Error(
      'The server could not complete this request. If you are running locally, check the Fundoo API logs and configuration, then try again.'
    );
  }

  return new Error(fallbackMessage);
}
