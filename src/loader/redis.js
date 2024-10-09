const redis = require('redis');

const client = redis.createClient({
    url: 'redis://127.0.0.1:6379'
});

client.on('error', (err) => {
    console.log('Redis Client Error', err);
});

const connectRedis = async () => {
    if (!client.isOpen) {
        await client.connect();
    }
};

const disconnectRedis = async () => {
    if (client.isOpen) {
        await client.quit();
    }
};

module.exports = {
    client,
    connectRedis,
    disconnectRedis
};
