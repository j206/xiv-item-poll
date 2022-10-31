import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  getWeaponById: publicProcedure
    // validate
    .input(z.object({ id: z.number() }))
    // query
    .query(async ({ input }) => {
      

      const weapon = await fetch("https://xivapi.com/Action/127", { mode: 'cors' })
      .then(response => response.json())
      .then(data => console.info(data.Name_en))

      return {
        weapon: `hello ${weapon}`
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
