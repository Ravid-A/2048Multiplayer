import "dotenv/config";

const GetSocketUrl = () => {
  return `http://${process.env.NEXT_PUBLIC_API_SERVER_HOST}:${process.env.NEXT_PUBLIC_API_SOCKET_PORT}`;
};

export default GetSocketUrl;
