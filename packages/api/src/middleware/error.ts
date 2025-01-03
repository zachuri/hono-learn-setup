import { getSentry } from '@hono/sentry';
import type { ErrorHandler } from 'hono';
import type { StatusCode } from 'hono/utils/http-status';
import httpStatus from 'http-status';
import type { Toucan } from 'toucan-js';
import { ZodError } from 'zod';
import { generateZodErrorMessage } from '../utils/zod';
import { ApiError } from '../utils/ApiError';
import { AppContext } from '../utils/context';

const genericJSONErrMsg = 'Unexpected end of JSON input';

export const errorConverter = (err: unknown, sentry: Toucan): ApiError => {
  let error = err;

  if (error instanceof ZodError) {
    const errorMessage = generateZodErrorMessage(error);
    error = new ApiError(httpStatus.BAD_REQUEST, errorMessage);
  } else if (
    error instanceof SyntaxError &&
    error.message.includes(genericJSONErrMsg)
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid JSON payload');
  } else if (!(error instanceof ApiError)) {
    const castedErr = (typeof error === 'object' ? error : {}) as Record<
      string,
      unknown
    >;
    const statusCode: number =
      typeof castedErr.statusCode === 'number'
        ? castedErr.statusCode
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = (castedErr.description ||
      castedErr.message ||
      httpStatus[`${statusCode}` as keyof typeof httpStatus]) as string;

    if (statusCode >= 500) {
      // Log any unhandled application error
      sentry.captureException(error);
    }

    error = new ApiError(statusCode, message, false);
  }
  return error as ApiError;
};

export const errorHandler: ErrorHandler<AppContext> = async (err, c) => {
  // Can't load config in case error is inside config so load env here and default
  // to highest obscurity aka production if env is not set
  const env = c.env.WORKER_ENV || 'production';
  const sentry = getSentry(c);
  const error = errorConverter(err, sentry);

  if (env === 'production' && !error.isOperational) {
    error.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    error.message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR].toString();
  }

  const response = {
    code: error.statusCode,
    message: error.message,
    ...(env === 'development' && { stack: err.stack }),
  };

  // eslint-disable-next-line no-param-reassign
  delete c.error;
  return c.json(response, error.statusCode as StatusCode);
};
