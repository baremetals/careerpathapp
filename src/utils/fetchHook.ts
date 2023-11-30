import { ERROR_MESSAGES } from '../lib/error-messages';
import AppError from './appError';
import { fetch } from 'undici';

export default async function fetchHook<T, U>(
  url: string,
  body: T,
): Promise<U> {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Handle HTTP errors
      console.error(`HTTP error: ${res.status}`);
      throw new AppError(ERROR_MESSAGES.SERVER_GENERIC, res.status);
    }

    try {
      return (await res.json()) as U;
    } catch (jsonError) {
      console.error('JSON parsing error:', jsonError);
      throw new AppError(ERROR_MESSAGES.SERVER_RESPONSE_NOT_JSON, res.status);
    }
  } catch (error: any) {
    console.error('Fetch error:', error);
    throw new AppError(
      error.message || ERROR_MESSAGES.SERVER_GENERIC,
      error.status ? error.status : 500,
    );
  }
}

// export default async function fetchHook<T, U>(
//   url: string,
//   body: T,
// ): Promise<U> {
//   console.log('calling python server-------------------------<');

//   try {
//     const response = await axios.post(url, body, {
//       headers: {
//         'Content-Type': 'application/json',
//         host: 'localhost:4000',
//       },
//     });

//     // Assuming the response data is directly the desired data of type U
//     return response.data as U;
//   } catch (error: any) {
//     // Check if error is an AxiosError
//     if (axios.isAxiosError(error)) {
//       const axiosError = error as AxiosError;
//       console.error('HTTP error:', axiosError.message);
//       if (axiosError.response) {
//         // Handle HTTP errors
//         throw new AppError(
//           ERROR_MESSAGES.SERVER_GENERIC,
//           axiosError.response.status,
//         );
//       } else {
//         throw new AppError(ERROR_MESSAGES.SERVER_GENERIC, 500);
//       }
//     } else {
//       // Handle other types of errors
//       console.error('Fetch error:', error);
//       throw new AppError(error.message || ERROR_MESSAGES.SERVER_GENERIC, 500);
//     }
//   }
// }
