// import { createClient } from 'redis';

// const redisClient = createClient({
//     socket: {
//         host: '127.0.0.1',
//         port: 6379,
//         reconnectStrategy: (retries) => {
//             return Math.min(retries * 50, 2000);
//         },
//     }
// });

// redisClient.on('error', (err) => console.error('Redis error:', err));

// (async () => {
//     try {
//         await redisClient.connect();
//         console.log('Connected to Redis');
//     } catch (err) {
//         console.error('Redis connection failed:', err);
//     }
// })();

// export default redisClient;

import { createClient } from 'redis';
import { env } from './env.config';

const redisClient = createClient({
    url: env.UPSTASH_REDIS_REST_URL,
    password: env.UPSTASH_REDIS_REST_TOKEN
});

redisClient.on('error', (err) => console.error('Redis error:', err));

(async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Upstash Redis');
    } catch (err) {
        console.error('Redis connection failed:', err);
    }
})();

export default redisClient;