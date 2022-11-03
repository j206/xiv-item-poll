import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { env } from "../../../env/server.mjs";

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
        job: selectedWeapon.ClassJobCategory.Name
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
