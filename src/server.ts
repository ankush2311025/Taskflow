import app from './app.js';
import dotenv from 'dotenv'

dotenv.config();

const PORT = process.env.PORT;

console.log(`PORT from env: ${PORT}`)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})