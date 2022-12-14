import { type NextPage } from "next";
import { useState } from "react";
import { getOptionsForVote } from "../utils/getRandomWeap";
import { trpc } from "../utils/trpc";

import Image from "next/image";
import Link from "next/link";

const Home: NextPage = () => {
  const [ids, updateIds] = useState(getOptionsForVote());
  const [first, second] = ids;

  const [showModal, setShowModal] = useState(false);

  const prepareModal = () => {
    return;
  };

  // TODO: probably bad loading condition
  if (!first || !second) return null;

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
  if (!firstWeapon.data || !secondWeapon.data)
    return (
      <div className="relative flex h-screen w-screen flex-col items-center justify-center">
        <div className="font-bold">Progging...</div>
        <div className="p-1" />
        <img src="/puff.svg" alt="Loading animation" />
      </div>
    );

  const voteForWeapon = (selected: number) => {
    if (selected === first) {
      voteMutation.mutate({ votedFor: first, votedAgainst: second });
    } else {
      voteMutation.mutate({ votedFor: second, votedAgainst: first });
    }

    updateIds(getOptionsForVote());
  };

  return (
    <>
      {showModal ? <ImageModal toggleModal={setShowModal} /> : null}
      <div className="flex h-screen w-screen flex-col items-center max-lg:overflow-hidden max-lg:pt-8 lg:justify-center">
        <div className="text-center text-2xl font-bold">
          Which Ultimate Weapon is cooler?
        </div>
        <div className="p-2" />
        <div className="flex max-w-3xl items-center justify-between rounded border p-8 max-lg:flex-col max-sm:max-w-xs">
          <div className="h-100 flex w-80 flex-col items-center">
            <Image
              src={firstWeapon.data.iconUrl}
              className="cursor-pointer pb-2 hover:animate-pulse sm:shrink-0 md:shrink-0"
              width={80}
              height={80}
              onClick={() => voteForWeapon(first)}
              alt="Icon of first Ultimate Weapon"
            />
            <div className="font-bold">{firstWeapon.data.name}</div>
            <div className="text-xs">{firstWeapon.data.job}</div>
            <UltimateTitle id={firstWeapon.data.id} />
            <div
              className="cursor-pointer"
              onClick={() => setShowModal(!showModal)}
            >
              ????
            </div>
          </div>
          <div className="p-8 text-2xl font-extrabold">Vs.</div>
          <div className="h-100 flex w-80 flex-col items-center">
            <Image
              src={secondWeapon.data.iconUrl}
              className="cursor-pointer pb-2 hover:animate-pulse sm:shrink-0 md:shrink-0"
              width={80}
              height={80}
              onClick={() => voteForWeapon(second)}
              alt="Icon of second Ultimate Weapon"
            />
            <div className="font-bold">{secondWeapon.data.name}</div>
            <div className="text-xs">{secondWeapon.data.job}</div>
            <UltimateTitle id={secondWeapon.data.id} />
            <div
              className="cursor-pointer"
              onClick={() => setShowModal(!showModal)}
            >
              ????
            </div>
          </div>
        </div>
        <div className="text-center text-xl">
          <Link href="/results">Results</Link>
        </div>
      </div>
    </>
  );
};

const UltimateTitle = (weapon: { id: number }) => {
  let textFormat;
  let ultimateTitle;
  if (weapon.id >= 20959 && weapon.id <= 20974) {
    textFormat = "text-xs text-yellow-500";
    ultimateTitle = `The Unending Coil of Bahamut`;
  } else if (weapon.id >= 22868 && weapon.id <= 22883) {
    textFormat = "text-xs text-blue-400";
    ultimateTitle = `The Weapon's Refrain`;
  } else if (weapon.id >= 28289 && weapon.id <= 28306) {
    textFormat = "text-xs text-yellow-100";
    ultimateTitle = `The Epic of Alexander`;
  } else if (weapon.id >= 36943 && weapon.id <= 36962) {
    textFormat = "text-xs text-red-600";
    ultimateTitle = `Dragonsong's Reprise`;
  }
  return <div className={textFormat}>{ultimateTitle}</div>;
};

const ImageModal = ({ toggleModal }: any) => {
  return (
    <div
      onClick={() => toggleModal(false)}
      className="modal fixed flex items-center justify-center"
    >
      <div className="overlay h-screen w-screen bg-black bg-opacity-50 backdrop-blur"></div>
      <div className="absolute align-middle transition-opacity">
        <Image
          className="border shadow-2xl shadow-black"
          src={`/weapons/${Math.floor(Math.random() * (15 - 0 + 1)) + 0}.jpg`}
          width={600}
          height={719}
          placeholder="blur"
          alt="Screenshot of UCOB weapon."
        />
        <div className="content top-2/4 text-center text-xs text-slate-300">
          <p>Click/Tap anywhere to close</p>
          <p>Placeholder is displaying a random UCOB weapon</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
