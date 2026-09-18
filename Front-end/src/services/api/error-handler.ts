// Error Handling Utilities
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.statusText || 'An error occurred';
    return new ApiError(message, error.response.status, error.response.data);
  } else if (error.request) {
    // Request made but no response received
    return new ApiError('Network error - No response from server', 0);
  } else {
    // Error in setting up the request
    return new ApiError(error.message || 'An unexpected error occurred', 0);
  }
};

export const getErrorMessage = (error: any): string => {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
