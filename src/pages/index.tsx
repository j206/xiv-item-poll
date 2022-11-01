import { type NextPage } from "next";
import React from "react";
import { getOptionsForVote } from "../utils/getRandomWeap";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [first, second] = React.useMemo(() => getOptionsForVote(), []);

  const firstWeapon = trpc.getWeaponById.useQuery({ id: 24824842 });
  const secondWeapon = trpc.getWeaponById.useQuery({ id: 24824842 });
  if (!firstWeapon.data || !secondWeapon.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">
        Which Ultimate Weapon is cooler?
      </div>
      <div>{firstWeapon.data.weapon}</div>
      <div className="p-2" />
      <div className="flex max-w-2xl items-center justify-between rounded border p-8">
        <div className="h-16 w-16 bg-red-800">{first}</div>
        <div className="p-8">Vs.</div>
        <div className="h-16 w-16 bg-red-800">{second}</div>
      </div>
    </div>
  );
};

export default Home;
