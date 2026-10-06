export const appErrorCatalog = {
  invalidCredentials: {
    statusCode: 401,
    message: "Invalid email or password",
  },
  emailNotVerified: {
    statusCode: 403,
    message: "Please verify your email before logging in.",
  },
  userAlreadyExists: {
    statusCode: 409,
    message: "User already exists",
  },
} as const;

export type AppErrorKind = keyof typeof appErrorCatalog;

export type AppError = Error & {
  isAppError: true;
  statusCode: number;
};

export function appError(kind: AppErrorKind): AppError {
  const { statusCode, message } = appErrorCatalog[kind];

  return Object.assign(new Error(message), {
    isAppError: true as const,
    statusCode,
  });
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof Error && "isAppError" in error;
}
