import axios from 'axios';

/**
 * Makes a GET request using axios.
 * @param {string} url - The URL to fetch.
 * @param {AbortSignal} [signal] - Optional AbortController signal to cancel the request (axios v1+).
 * @returns {Promise<object|undefined>} Response data, or undefined on error/abort.
 */
export const GetRequest = async (url, signal) => {
  try {
    const apiResponse = await axios.get(url, {signal});
    const response = apiResponse.status === 200 ? apiResponse.data : {};
    return response;
  } catch (err) {
    // Ignore abort errors — caller cancelled the request intentionally
    if (axios.isCancel(err) || err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') {
      return;
    }
    return;
  }
};
