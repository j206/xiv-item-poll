import { type NextPage } from "next";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomWeap";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;

  // TODO: probably bad loading condition
  if (!first || !second) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">Progging...</div>
      </div>
    );
  }

  const firstWeapon = trpc.getWeaponById.useQuery(
    { id: first },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );
  const secondWeapon = trpc.getWeaponById.useQuery(
    { id: second },
    {
      refetchInterval: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  );

  const voteMutation = trpc.castVote.useMutation();

  // TypeScript appeasement
  if (!firstWeapon.data || !secondWeapon.data) return null;

  const voteForWeapon = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    updateIds(getOptionsForVote());
  };

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">
        Which Ultimate Weapon is cooler?
      </div>
      <div className="p-2" />
      <div className="flex max-w-3xl items-center justify-between rounded border p-8">
        <div className="h-100 flex w-80 flex-col items-center">
          <Image
            src={firstWeapon.data.iconUrl}
            className="cursor-pointer pb-2"
            width={80}
            height={80}
            onClick={() => voteForWeapon(first)}
            alt="Icon of first Ultimate Weapon"
          />
          <div className="object-scale-down font-bold">
            {firstWeapon.data.name}
          </div>
          <div className="text-xs">{firstWeapon.data.job}</div>
        </div>
        <div className="p-8 text-2xl font-extrabold">Vs.</div>
        <div className="h-100 flex w-80 flex-col items-center">
          <Image
            src={secondWeapon.data.iconUrl}
            className="cursor-pointer pb-2"
            width={80}
            height={80}
            onClick={() => voteForWeapon(second)}
            alt="Icon of second Ultimate Weapon"
          />
          <div className="font-bold">{secondWeapon.data.name}</div>
          <div className="text-xs">{secondWeapon.data.job}</div>
        </div>
      </div>
      <div className="text-center text-xl">
        <Link href="/results">Results</Link>
      </div>
    </div>
  );
};

export default Home;
