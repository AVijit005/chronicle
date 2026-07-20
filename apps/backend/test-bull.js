const { Queue } = require('bullmq');
console.log('Creating queue...');
const q = new Queue('test', { connection: { host: 'localhost', port: 6379, lazyConnect: true } });
console.log('Queue created.');
q.on('error', (err) => console.log('Queue error:', err.message));
setTimeout(() => {
  console.log('3 seconds passed, did not crash.');
  process.exit(0);
}, 3000);
