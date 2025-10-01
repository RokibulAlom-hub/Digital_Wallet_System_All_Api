import z from "zod";

export const zodWalletValidation = z.object({
    balance:z.number().min(0).optional(),
    user: z.string()
})