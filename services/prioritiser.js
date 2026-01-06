export const analyseTicket = (ticket) =>{
    let urgency = 'NORMAL';
    let hourstoResolve = '24';

    const p = ticket.priority.toUpperCase();
    if(p === 'CRITICAL'||p==='HIGH'){
        urgency = 'IMMEDIATE';
        hourstoResolve = '4';
    }

    const text = ticket.summary.toLowerCase();
    if (text.includes('fire')||text.includes('database')){
        urgency='EMERGENCY';
        hourstoResolve = '1';
    }

    const deadline = new Date();
    deadline.setHours(deadline.getHours()+hourstoResolve);

    return {
        ...ticket,
        urgency,
        deadline,
        processedAt: new Date()
    };
}