// SocketSetup.ts
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.251.111:3005';
// const SOCKET_SERVER_URL = 'http://192.168.1.4̥2:3005';

// Singleton socket instance
class SocketService {
  private static instance: SocketService;
  public socket: ReturnType<typeof io>;

  private constructor() {
    this.socket = io(SOCKET_SERVER_URL);

    this.socket.on('connect', () => {
      console.log('Socket connected!');
    });

    this.socket.on('data', (newData) => {
      console.log('Data received:', newData);
    //   socketData.value = [...socketData.value, newData];
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection Error:', error);
    });
  }

  public static getInstance() {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public emit(event: string, data?: any) {
    this.socket.emit(event, data);
  }
}



export default SocketService.getInstance();
