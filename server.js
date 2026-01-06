import express, { json } from 'express';
import cleanTicket from './utils/cleaner.js';
import { analyseTicket } from './services/prioritiser.js';
import connectDB from './config/db.js';
import Ticket from './models/Ticket.js';
import ticketSchema from './utils/validationSchema.js';


const app = express();
connectDB();
app.use(json());
app.post("/webhook",async(req,res)=>{
    console.log("Raw data recieved")
    try {

        const {error} = ticketSchema.validate(req.body);
        if(error){
            console.log("Blocked Invalid Request:", error.details[0].message);
            return res.status(400).send({ error: error.details[0].message });
        }
    
    const ticket = cleanTicket(req.body);
    const analyse = analyseTicket(ticket);
    //idempotent
    try {
        const savedTicket = await Ticket.findOneAndUpdate(
            {ticketID:analyse.ticketID},
            analyse,{
                upsert:true,
                new:true,
                setDefaultsOnInsert:true
            }
        );
        res.status(200).send('WebHook received');
    } catch (error) {
        res.status(500).send('error');
    }
    } catch (error) {
        console.log("Error processing ticket:", error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

app.listen(3000,()=>{
    console.log("server running on port 3000");
});