const cleanTicket = (payload) =>{
    //remeber to add if paylod doesnt exists
    //example json structre
//     {
//   "issue": {
//     "key": "SUP-101",
//     "fields": {
//       "summary": "Database is on fire",
//       "priority": { "name": "Critical" },
//       "assignee": null,
//       "customfield_10029": "US-East-1"
//     }
//   }
// }
    const fields = payload.issue.fields;
    return {
        ticketID : payload.issue.key,
        summary: fields.summary,
        priority: fields.priority.name,
        assignedTo : fields.assigne ? fields.assigne.emailAddress : "Unassigned",
        region : fields.customfield_10029 || "unknown"
    }
}

export default cleanTicket;