import { type NextPage } from "next";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomWeap";
import { trpc } from "../utils/trpc";

const btn =
  "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow";

const Home: NextPage = () => {
  // const [first, second] = useMemo(() => getOptionsForVote(), []);
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;

  // TODO: probably bad loading display
  if (!first || !second) {
    return null;
  }
  const firstWeapon = trpc.getWeaponById.useQuery({ id: first });
  const secondWeapon = trpc.getWeaponById.useQuery({ id: second });
  // TODO: also bad loading display
  if (!firstWeapon.data || !secondWeapon.data) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">Progging...</div>
      </div>
    );
  }

  // https://xiv-item-poll-jrtryg6qe-j206.vercel.app/api/trpc/getWeaponById?batch=1&input=%7B%220%22%3A%7B%22json%22%3A%7B%22id%22%3A36948%7D%7D%7D
  const voteForWeapon = (selected: number) => {
    // TODO: mutation to persist changes
    // problem 1: persisting of votes
    // problem 2: data fetched from API
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
          <img
            src={`http://xivapi.com${firstWeapon.data.icon}`}
            className="object-fill cursor-pointer"
            onClick={() => voteForWeapon(second)}
            alt="Icon of first Ultimate Weapon"
            
          />
          <div className="font-bold object-scale-down">{firstWeapon.data.name}</div>
          <div className="text-xs">{firstWeapon.data.job}</div>
        </div>
        <div className="p-8 text-2xl font-extrabold">Vs.</div>
        <div className="h-100 flex w-80 flex-col items-center">
          <img
            src={`http://xivapi.com${secondWeapon.data.icon}`}
            className="object-fill cursor-pointer"
            onClick={() => voteForWeapon(second)}
            alt="Icon of second Ultimate Weapon"
          />
          <div className="font-bold">{secondWeapon.data.name}</div>
          <div className="text-xs">{secondWeapon.data.job}</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
