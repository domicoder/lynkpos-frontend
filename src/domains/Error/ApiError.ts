/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiError {
  response: {
    data: {
      message: any;
    };
  };
}
