const axios = require("axios");


const http = axios.create({

  baseURL: process.env.NIBSS_BASE_URL,

  timeout: 15000

});


let cachedToken = null;
let cachedTokenExpiry = 0;


// Calls NIBSS's POST /api/auth/token to get an access token
const getToken = async () => {

  const now = Date.now();


  if (cachedToken && now < cachedTokenExpiry) {

    return cachedToken;

  }


  const response = await axios.post(
    `${process.env.NIBSS_BASE_URL}/api/auth/token`,
    {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET
    }
  );


  const data = response.data;


  // NOTE: confirm the real field name against Swagger / a console.log(data)
  cachedToken = data.token || data.accessToken || data.access_token;

  const expiresInSeconds = data.expiresIn || data.expires_in || 3300;

  cachedTokenExpiry = now + (expiresInSeconds * 1000) - 30000;


  if (!cachedToken) {

    throw new Error("NIBSS login did not return a recognizable token field");

  }


  return cachedToken;

};


// Every authenticated NIBSS call goes through this — fetches/reuses
// the token and attaches it as a Bearer header, retrying once on 401.
const nibssRequest = async (method, url, options = {}) => {

  const { data, params } = options;

  const token = await getToken();


  try {

    const res = await http.request({

      method,

      url,

      data,

      params,

      headers: {
        Authorization: `Bearer ${token}`
      }

    });


    return res.data;

  } catch (error) {

  console.log("NIBSS ERROR STATUS:", error.response?.status);
  console.log("NIBSS ERROR DATA:", error.response?.data);
  console.log("NIBSS ERROR URL:", error.config?.url);
  console.log("NIBSS ERROR REQUEST DATA:", error.config?.data);

  if (error.response?.status === 401) {
      cachedToken = null;

      const freshToken = await getToken();


      const res = await http.request({

        method,

        url,

        data,

        params,

        headers: {
          Authorization: `Bearer ${freshToken}`
        }

      });


      return res.data;

    }


    throw error;

  }

};


module.exports = {
  nibssRequest
};