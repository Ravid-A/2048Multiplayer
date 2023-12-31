const GetAPIUrl = () => {
  return `http://${process.env.API_SERVER_HOST}:${process.env.API_SERVER_PORT}/api`;
};

export default GetAPIUrl;
