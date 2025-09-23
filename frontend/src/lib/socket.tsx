import io from "socket.io-client";
 
type SocketType = ReturnType<typeof io>;
 
let socket: SocketType | null = null;
 
export const getSocket = (url: string, access_token: string): SocketType => {
  if (!socket) {
    socket = io(url, {
      auth: { access_token },
      transports: ["websocket"],
    });
  }
  return socket;
};