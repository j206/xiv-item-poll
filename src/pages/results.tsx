import type { GetServerSideProps } from "next";
import { prisma } from "../server/db/client";
import type { AsyncReturnType } from "../utils/ts-infer-return";

import Image from "next/image";
import Link from "next/link";

const getWeaponsInOrder = async () => {
  return await prisma.weapon.findMany({
    orderBy: [
      { VoteFor: { _count: "desc" } },
      { VoteAgainst: { _count: "asc" } },
    ],
    select: {
      id: true,
      name: true,
      iconUrl: true,
      _count: {
        select: {
          VoteFor: true,
          VoteAgainst: true,
        },
      },
    },
  });
};

const generateCountPercent = (weapon: WeaponQueryResult[number]) => {
  const { VoteFor, VoteAgainst } = weapon._count;
  if (VoteFor + VoteAgainst === 0) return 0;
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

type WeaponQueryResult = AsyncReturnType<typeof getWeaponsInOrder>;

const WeaponListing: React.FC<{ weapon: WeaponQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex items-center justify-between border-b p-2">
      <div className="flex items-center">
        <Image
          src={props.weapon.iconUrl}
          width={64}
          height={64}
          alt="Icon of an Ultimate Weapon"
        />
        <div className="pl-2 font-bold">{props.weapon.name}</div>
      </div>
      <div className="pr-4">
        {generateCountPercent(props.weapon).toFixed(2) + "%"}
      </div>
    </div>
  );
};

const ResultsPage: React.FC<{
  weapons: WeaponQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <div className="p-4 text-center">
        <h2 className="text-2xl font-bold">Results</h2>
        <Link href="/">
          <h6 className="text-xs text-slate-400">Back</h6>
        </Link>
      </div>
      <div className="flex w-full max-w-xl flex-col border">
        {props.weapons
          .sort((a, b) => {
            const diff = generateCountPercent(b) - generateCountPercent(a);
            if (diff === 0) return b._count.VoteFor - a._count.VoteFor;
            return diff;
          })

          .map((currentWeapon) => {
            return (
              <WeaponListing weapon={currentWeapon} key={currentWeapon.id} />
            );
          })}
      </div>
    </div>
  );
};

export default ResultsPage;

export const getStaticProps: GetServerSideProps = async () => {
  const weaponOrdered = await getWeaponsInOrder();
  return { props: { weapons: weaponOrdered }, revalidate: 20 };
};
