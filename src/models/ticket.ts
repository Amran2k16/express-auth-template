import mongoose from "mongoose";

// Attrs define what is required to create a ticket
interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

// Doc defines all the properties that will exist after a ticket is created
interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

// Defines all the properties available on a ticket model
interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

// Defining the schema
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);
// Must define this before Ticket
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);
export { Ticket };
