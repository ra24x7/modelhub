import { app } from "./app";
import { cors } from '@elysiajs/cors'


app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
})).listen(3000);