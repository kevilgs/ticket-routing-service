import express, { json } from 'express';
import cleanTicket from './utils/cleaner.js';
import { analyseTicket } from './services/prioritiser.js';
import connectDB from './config/db.js';
import Ticket from './models/Ticket.js';
import ticketSchema from './utils/validationSchema.js';
import rateLimit from 'express-rate-limit';
import logger from './utils/logger.js';


const app = express();
const limiter = rateLimit({
    windowMs:1*60*1000,
    max:10, //testing purpose
    standardHeaders:true,
    legacyHeaders:false,
    message:"Too many tickets"
});
// app.use(limiter);
connectDB();
app.use(json());
app.post("/webhook",async(req,res)=>{
    try {

        const {error} = ticketSchema.validate(req.body);
        if(error){
            logger.error("Blocked Invalid Request:", error.details[0].message);
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
        logger.error("Error processing ticket:", error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/tickets',async(req,res)=>{
    try {
        const {priority,urgency,limit=10,page=1} = req.query;
        const query= {}
        if(priority){
            query['priority'] = {$regex: priority, $options: 'i'};
        }
        if(urgency){
            query['urgency'] = urgency
        }

        const skip = (page-1)*limit;

        const tickets = await Ticket.find(query).sort({processedAt:-1}).limit(Number(limit)).skip(skip);

        const total = await Ticket.countDocuments(query);

        res.status(200).json({
            success: true,
            count: tickets.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: tickets
        });
    } catch (error) {
        res.status(500).json({ error: 'Server Error' });
    }
});

app.listen(3000,()=>{
    logger.info("server running on port 3000");
});