import { type NextPage } from "next";
import React from "react";
import { getOptionsForVote } from "../utils/getRandomItem";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const [first, second] = React.useMemo(() => getOptionsForVote(), []);
  const hello = trpc.hello.useQuery({ text: "client" });
  if (!hello.data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="text-center text-2xl">
        Which Ultimate Weapon is cooler?
      </div>
      <div className="p-2" />
      <div className="flex max-w-2xl items-center justify-between rounded border p-8">
        <div className="h-16 w-16 bg-red-800">{hello.data.greeting}</div>
        <div className="p-8">Vs.</div>
        <div className="h-16 w-16 bg-red-800">wabba</div>
      </div>
    </div>
  );
};

export default Home;
