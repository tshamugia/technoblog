import { prisma } from './utils/prisma-client.js';
import { app } from './app.js';
prisma
    .$connect()
    .then(() => {
    console.log('Connected to the database');
    return { message: 'Connected to the database' };
})
    .catch((error) => {
    console.error('Error connecting to the database:', error);
    return { error };
});
// eslint-disable-next-line no-undef
const PORT = typeof process !== 'undefined' && process.env && process.env.PORT ? process.env.PORT : 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-undef
    console.log(`Server is running on port ${PORT}`);
});
