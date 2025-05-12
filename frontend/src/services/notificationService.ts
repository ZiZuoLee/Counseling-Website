import { io, Socket } from 'socket.io-client';

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect() {
    if (!this.socket) {
      this.socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:3001', {
        auth: {
          token: localStorage.getItem('token'),
        },
      });

      this.socket.on('connect', () => {
        console.log('Connected to notification service');
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from notification service');
      });

      // Handle appointment status updates
      this.socket.on('appointment:status', (data) => {
        this.notifyListeners('appointment:status', data);
      });

      // Handle new appointment requests
      this.socket.on('appointment:new', (data) => {
        this.notifyListeners('appointment:new', data);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribe(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  unsubscribe(event: string, callback: Function) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  private notifyListeners(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }
}

export const notificationService = new NotificationService();
export default notificationService; 