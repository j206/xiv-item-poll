import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { prisma } from "../../../server/db/client";

export const appRouter = router({
  getWeaponById: publicProcedure
    // validate
    .input(z.object({ id: z.number() }))
    // query
    .query(async ({ input }) => {
      const selectedWeapon = await prisma.weapon.findFirst({
        where: { id: input.id },
      });

      if (!selectedWeapon) throw new Error("Weapon doesn't exist!");
      return selectedWeapon;
    }),
  castVote: publicProcedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const voteInDb = await prisma.vote.create({
        data: {
          votedForId: input.votedFor,
          votedAgainstId: input.votedAgainst,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
