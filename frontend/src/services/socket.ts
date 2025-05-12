import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io('http://localhost:5000', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      this.socket.on('connect', () => {
        console.log('Connected to Socket.IO server');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from Socket.IO server');
      });

      this.socket.on('error', (error) => {
        console.error('Socket.IO error:', error);
      });
    }
    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('join_room', roomId);
    }
  }

  leaveRoom(roomId: string) {
    if (this.socket) {
      this.socket.emit('leave_room', roomId);
    }
  }

  sendMessage(roomId: string, message: string) {
    if (this.socket) {
      this.socket.emit('send_message', {
        roomId,
        content: message,
        timestamp: new Date(),
      });
    }
  }

  onMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  offMessage(callback: (message: any) => void) {
    if (this.socket) {
      this.socket.off('receive_message', callback);
    }
  }
}

export const socketService = new SocketService();
export default socketService; 