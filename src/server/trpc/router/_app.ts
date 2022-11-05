import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const appRouter = router({
  getWeaponById: publicProcedure
    // validate
    .input(z.object({ id: z.number() }))
    // query
    .query(async ({ input }) => {
      console.log("API call");
      const selectedWeapon = await fetch(
        `https://xivapi.com/item/${input.id}?columns=ID,Name,IconHD,ClassJobCategory.Name&?private_key=${env.XIVAPI_PRIVATE_KEY}`,
        {
          mode: "cors",
        }
      ).then((response) => response.json());

      return {
        name: selectedWeapon.Name,
        id: selectedWeapon.ID,
        icon: selectedWeapon.IconHD,
        job: selectedWeapon.ClassJobCategory.Name,
      };
    }),
  castVote: publicProcedure
    .input(
      z.object({
        votedFor: z.number(),
        votedAgainst: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      // TODO: Prisma import shenanigans
      const voteInDb = await prisma.vote.create({
        data: {
          ...input,
        },
      });
      return { success: true, vote: voteInDb };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
