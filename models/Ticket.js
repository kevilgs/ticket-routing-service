import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    ticketID : {type:String,required:true,unique:true},
    summary: String,
    priority: {type:String,index:true},
    urgency: {type:String,index:true},
    assignedTo: String,
    region: String,
    deadline: Date,
    processedAt: Date
});

const Ticket = mongoose.model('Ticket',ticketSchema);
export default Ticket;