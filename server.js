import 'dotenv/config';
import express, { json } from 'express';
import rateLimit from 'express-rate-limit';
import ticketSchema from './utils/validationSchema.js';
import cleanTicket from './utils/cleaner.js';
import { analyseTicket } from './services/prioritiser.js';
import connectDB from './config/db.js';
import Ticket from './models/Ticket.js';
import logger from './utils/logger.js';

const BATCH_SIZE = 50; 
const FLUSH_INTERVAL = 5000;

let ticketBuffer = [];

const flushBuffer = async () => {
    if (ticketBuffer.length === 0) return;

    const bufferToSave = [...ticketBuffer];
    ticketBuffer = []; 

    // console.log(`Flushing ${bufferToSave.length} tickets to MongoDB...`);

    const operations = bufferToSave.map(ticket => ({
        updateOne: {
            filter: { ticketID: ticket.ticketID },
            update: { 
                $set: ticket,
                $setOnInsert: { __v: 0 }, 
                $inc: { __v: 1 }          
            },
            upsert: true
        }
    }));

    try {
        await Ticket.bulkWrite(operations, { ordered: false });
        console.log(`Successfully processed ${bufferToSave.length} tickets.`);
    } catch (err) {
        console.error("Bulk Write Error:", err.message);
    }
};

setInterval(flushBuffer, FLUSH_INTERVAL);

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(json());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many tickets"
});
// app.use(limiter);
app.post("/webhook", async (req, res) => {
    try {
        const { error } = ticketSchema.validate(req.body);
        if (error) {
            logger.error("Blocked Invalid Request:", error.details[0].message);
            return res.status(400).send({ error: error.details[0].message });
        }
        const ticket = cleanTicket(req.body);
        const analysedTicket = analyseTicket(ticket);
        ticketBuffer.push(analysedTicket);

        if (ticketBuffer.length >= BATCH_SIZE) {
            flushBuffer();
        }
        res.status(202).send({ message: 'Ticket queued for processing' });

    } catch (error) {
        logger.error("Error processing ticket:", error);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

app.get('/tickets', async (req, res) => {
    try {
        const { priority, urgency, limit = 10, page = 1 } = req.query;
        const query = {};
        
        if (priority) {
            query['priority'] = { $regex: priority, $options: 'i' };
        }
        if (urgency) {
            query['urgency'] = urgency;
        }

        const skip = (page - 1) * limit;
        const tickets = await Ticket.find(query)
            .sort({ processedAt: -1 })
            .limit(Number(limit))
            .skip(skip);

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

app.listen(PORT, () => {
    logger.info(`server running on port ${PORT}`);
});