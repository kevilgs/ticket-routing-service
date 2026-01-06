import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketID : {type:String,required:true,unique:true},
    summary: String,
    priority: String,
    urgency: String,
    assignedTo: String,
    region: String,
    deadline: Date,
    processedAt: Date
});

const Ticket = mongoose.model('Ticket',ticketSchema);
export default Ticket;