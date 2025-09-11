const http = require('http');
const app = require('./app');
const { connectDB } = require('./src/config/dbConfig');

const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB().then(() => {
    // Start the server after successful DB connection
    const server = http.createServer(app);
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to connect to the database:', err);
}); 
