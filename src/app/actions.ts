'use server'
import z from "zod";

export async function inviteAction(initialState: any, formData: FormData) {
    const InviteSchema = z.object({
      email: z.email(),
    });
    const parsedData = InviteSchema.safeParse({
      email: formData.get("email"),
    });
    if (!parsedData.success) {
      return {
        message: "Please enter a valid email address.",
      }
    }

    console.log("Inviting partner with email:", parsedData.data.email);
  }