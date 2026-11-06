import { Schema, model, models, InferSchemaType } from "mongoose";

const ContactMessageSchema = new Schema(
  {
    username: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

// ✅ النوع مستنتج مباشرة من الـ schema (أفضل من Document)
export type ContactMessageType = InferSchemaType<
  typeof ContactMessageSchema
>;

const ContactMessage =
  models.ContactMessage ??
  model<ContactMessageType>("ContactMessage", ContactMessageSchema);

export default ContactMessage;
