import { type NextPage } from "next";
import Image from "next/image";
import React from "react";
import { getOptionsForVote } from "../utils/getRandomWeap";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [first, second] = React.useMemo(() => getOptionsForVote(), []);

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
        <div className="h-16 w-16">
          <Image
            src={`http://xivapi.com${firstWeapon.data.icon}`}
            alt="Icon of Ultimate Weapon"
            width={80}
            height={80}
          />
        </div>
        <div className="p-8">Vs.</div>
        <div className="h-16 w-16">
          <Image
            src={`http://xivapi.com${secondWeapon.data.icon}`}
            alt="Icon of Ultimate Weapon"
            width={80}
            height={80}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
