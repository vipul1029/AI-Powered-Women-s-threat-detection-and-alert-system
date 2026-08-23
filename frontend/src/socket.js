import { io } from 'socket.io-client'

const socket = io('http://localhost:5000', {
  transports: ['websocket'],
  autoConnect: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1500,
})

export default socket
