import type { GetServerSideProps } from "next";
import { prisma } from "../server/db/client";
import type { AsyncReturnType } from "../utils/ts-infer-return";
import Image from "next/image";

const getWeaponsInOrder = async () => {
  return await prisma.weapon.findMany({
    orderBy: [{ VoteFor: { _count: "desc" } }, { id: "asc" }],
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
  const {VoteFor, VoteAgainst} = weapon._count;
  if (VoteFor + VoteAgainst ===0) return 0;
  return (VoteFor / (VoteFor + VoteAgainst)) * 100;
}

type WeaponQueryResult = AsyncReturnType<typeof getWeaponsInOrder>;

const WeaponListing: React.FC<{ weapon: WeaponQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex border-b p-2 items-center justify-between">
      <div className="flex items-center">
        <Image
          src={props.weapon.iconUrl}
          width={64}
          height={64}
          alt="Icon of an Ultimate Weapon"
        />
        <div className="pl-2 font-bold capitalize">{props.weapon.name}</div>
      </div>
      <div className="pr-4">{generateCountPercent(props.weapon) + "%"}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  weapons: WeaponQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="p-4 text-2xl">Results</h2>
      <div className="p-2" />
      <div className="flex w-full max-w-2xl flex-col border">
        {props.weapons.map((currentWeapon) => {
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
  return { props: { weapons: weaponOrdered }, revalidate: 60 };
};
