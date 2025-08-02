const io = require('socket.io-client');

const socket = io('http://localhost:3001');

socket.on('connect', () => {
  console.log('✅ Connected to server!');
  console.log('Socket ID:', socket.id);
  
  // Test joining a match room
  socket.emit('join-match', 'test-match-123');
  console.log('Joined test match room');
  
  // Disconnect after 3 seconds
  setTimeout(() => {
    socket.disconnect();
    console.log('Disconnected from server');
    process.exit(0);
  }, 3000);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from server');
});

socket.on('error', (error) => {
  console.error('❌ Socket error:', error);
});
