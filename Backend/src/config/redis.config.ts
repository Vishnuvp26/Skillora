import { createClient } from 'redis';

const redisClient = createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379
    }
});

redisClient.on('error', (err) => console.error('Redis error:', err));

redisClient.connect()
    .then(() => console.log('Connected to Redis'))
    .catch((err) => console.error('Redis connection failed:', err));

export default redisClient;