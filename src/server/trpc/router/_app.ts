import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const appRouter = router({
  getWeaponById: publicProcedure
    // validate
    .input(z.object({ id: z.number() }))
    // query
    .query(async ({ input }) => {
      const selectedWeapon = await fetch(
        `https://xivapi.com/item/${input}?columns=ID,Name,IconHD,ClassJobCategory.Name`,
        {
          mode: "cors",
        }
      ).then((response) => response.json());

      return {
        weapon: `hello ${selectedWeapon.ID}`,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;

// UCoB
// 20959 - 20974 (16)
// UWU
// 22868 - 22883 (16)
// TEA
// 28289 - 28306 (18)
// DSR
// 36943 - 36962 (20)

const getRandomWeapon = () => {
  const allWeaponSets = [
    [20959, 20974],
    [22868, 22883],
    [28289, 28306],
    [36943, 36962]
  ] as const;
  const weaponSet =
    allWeaponSets[Math.floor(Math.random() * allWeaponSets.length)];
  if (weaponSet?.[0] && weaponSet?.[1]) {
    return (
      Math.floor(Math.random() * (weaponSet[1] - weaponSet[0] + 1)) +
      weaponSet[0]
    );
  }
};

