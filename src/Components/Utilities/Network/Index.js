import axios from 'axios';

/**
 * Makes a GET request using axios.
 * @param {string} url - The URL to fetch.
 * @param {AbortSignal} [signal] - Optional AbortController signal to cancel the request (axios v1+).
 * @returns {Promise<object|undefined>} Response data, or undefined if cancelled.
 */
export const GetRequest = async (url, signal, timeout = 9000) => {
  try {
    const apiResponse = await axios.get(url, {signal, timeout});
    return apiResponse.data;
  } catch (err) {
    // Ignore abort errors — caller cancelled the request intentionally
    if (axios.isCancel(err) || err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
      return;
    }
    throw err;
  }
};
