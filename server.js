const { connectDB } = require('./src/config/dbConfig');
const { seedAdmin } = require('./src/config/dbSeeder');
const { app } = require('./app');

const PORT = process.env.PORT || 3000;

// Connect to the database
(async () => {
    try {
        await connectDB();
        console.log('Connected to the database successfully.');
        await seedAdmin(); // Seed admin user if not present
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database:', error.message);
    }
})();
