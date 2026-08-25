import { Elysia } from 'elysia';

export const ErrorHandler = new Elysia()
  .onError(({ code, error, set }) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[❌ ERROR ${code}]:`, errorMessage);

    if (code === 'VALIDATION') {
      set.status = 400;
      return {
        success: false,
        message: 'Invalid Request',
        details: error.all 
      };
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { success: false, message: 'Not Found' };
    }

    set.status = 500;
    return {
      success: false,
      message: 'Internal Server Error',
    };
  });