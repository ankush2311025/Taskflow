import { z } from "zod";

export const createOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
  }),
});
export const addMemberSchema = z.object({
    body: z.object({
        email: z.email(),
    })
})
export const updateOrganizationSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
  }),
});