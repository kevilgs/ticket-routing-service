import express, { json } from 'express';
import cleanTicket from './utils/cleaner.js';
import { analyseTicket } from './services/prioritiser.js';
import connectDB from './config/db.js';
import Ticket from './models/Ticket.js';


const app = express();
connectDB();
app.use(json());
app.post("/webhook",async(req,res)=>{
    console.log("Raw data recieved")
    const ticket = cleanTicket(req.body);
    const analyse = analyseTicket(ticket);
    try {
        const savedTicket = await Ticket.create(analyse);
        res.status(200).send('Received');
    } catch (error) {
        res.status(500).send('error');
    }
    
});

app.listen(3000,()=>{
    console.log("server running on port 3000");
});