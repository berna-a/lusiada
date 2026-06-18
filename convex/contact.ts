import { mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Regista uma mensagem do formulário de contacto.
 */
export const send = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    subject: v.optional(v.union(v.string(), v.null())),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contact_messages", {
      name: args.name.trim(),
      email: args.email.toLowerCase().trim(),
      subject: args.subject?.trim() ? args.subject.trim() : null,
      message: args.message.trim(),
      status: "new",
    });

    return { id };
  },
});
