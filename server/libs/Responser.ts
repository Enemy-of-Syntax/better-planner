type responseType<T> = {
  statusCode: number;
  message: string;
  devMessage: string;
  body: T;
};

export const Responser = ({
  statusCode,
  message,
  devMessage,
  body,
}: responseType<typeof body>) => {
  return {
    meta: {
      status: statusCode >= 200 && statusCode <= 300 ? true : false,
      message,
      devMessage,
    },
    body,
  };
};
