import express from 'express';
import morgan from 'morgan';
import cors from 'cors';


const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is healthy' });
});

app.get('/api/hello', (req, res) => {
    res.status(200).json({ message: 'Hello World!' });
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
        { id: 3, name: 'Alice Johnson' },
    ];
    res.status(200).json(users);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});