import io from 'socket.io-client';
import { useEffect } from 'react';

const socket = io();

// eslint-disable-next-line @typescript-eslint/ban-types
export default function useSocket(eventName: string, callback: Function): SocketIOClient.Socket {
    useEffect(() => {
        socket.on(eventName, callback);

        return function useSocketCleanup() {
            socket.off(eventName, callback);
        };
    }, [eventName, callback]);

    return socket;
}