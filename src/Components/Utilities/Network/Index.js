import axios from 'axios';
export const GetRequest = async url => {
  try {
    const apiResponse = await axios.get(url);
    const response = apiResponse.status === 200 ? apiResponse.data : {};
    return response;
  } catch (err) {
    return;
  }
};
