import { type NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomWeap";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  // const [first, second] = useMemo(() => getOptionsForVote(), []);
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;

  // TODO: probably bad
  if (!first || !second) {
    return null;
  }
  const firstWeapon = trpc.getWeaponById.useQuery({ id: first });
  const secondWeapon = trpc.getWeaponById.useQuery({ id: second });
  if (!firstWeapon.data || !secondWeapon.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">
        Which Ultimate Weapon is cooler?
      </div>
      <div className="p-2" />
      <div className="flex max-w-2xl items-center justify-between rounded border p-8">
        <div className="flex h-72 w-72 flex-col">
          <img
            src={`http://xivapi.com${firstWeapon.data.icon}`}
            className="w-full"
            alt="Icon of first Ultimate Weapon"
          />
          <div className="text-center">
            <div className="font-bold">{firstWeapon.data.name}</div>
            <div className="text-xs">{firstWeapon.data.job}</div>
          </div>
        </div>
        <div className="p-8">Vs.</div>
        <div className="flex h-72 w-72 flex-col">
          <img
            src={`http://xivapi.com${secondWeapon.data.icon}`}
            alt="Icon of second Ultimate Weapon"
          />
          <div className="text-center">
            <div className="font-bold">{secondWeapon.data.name}</div>
            <div className="text-xs">{secondWeapon.data.job}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
