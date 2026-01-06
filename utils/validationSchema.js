import Joi from "joi";

const ticketSchema = Joi.object({
    issue:Joi.object({
        key: Joi.string().required(),
        fields: Joi.object({
            summary: Joi.string().min(3).required(),
            priority: Joi.object({
                name: Joi.string().valid('Critical','High','Medium','Low').required()
            }).required(),
            assignee : Joi.any().allow(null).optional(),
        }).unknown(true).required()
    }).required()
});

export default ticketSchema