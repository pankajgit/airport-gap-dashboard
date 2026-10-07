import axios from "axios";

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    switch (status) {
      case 400:
        return "Invalid request.";

      case 401:
        return "Invalid email or password.";

      case 403:
        return "You are not authorized to perform this action.";

      case 404:
        return "The requested resource was not found.";

      case 422:
        return "Please check the information you entered.";

      case 429:
        return "Too many requests. Please try again later.";

      case 500:
        return "Server error. Please try again later.";

      default:
        return (
          error.response?.data?.message ||
          "Something went wrong. Please try again."
        );
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};
