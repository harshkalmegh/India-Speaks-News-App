import axios from "axios";
export const GetRequest = async (url) => {
  try {
    const apiResponse = await axios.get(url);
    // console.log({ apiResponse });

    const response = apiResponse.status === 200 ? apiResponse.data : {};

    return response;
  } catch (err) {
    return;
  }
};
