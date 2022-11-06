import type { GetServerSideProps } from "next";
import { prisma } from "../server/db/client";
import type { AsyncReturnType } from "../utils/ts-infer-return";
import Image from "next/image";

const getWeaponsInOrder = async () => {
  return await prisma.weapon.findMany({
    orderBy: { VoteFor: { _count: "desc" } },
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

type WeaponQueryResult = AsyncReturnType<typeof getWeaponsInOrder>;
const WeaponListing: React.FC<{ weapon: WeaponQueryResult[number] }> = (
  props
) => {
  return (
    <div className="flex items-center border-b p-2">
      <Image
        src={props.weapon.iconUrl}
        width={64}
        height={64}
        alt="Icon of an Ultimate Weapon"
      />
      <div className="pl-2 capitalize">{props.weapon.name}</div>
    </div>
  );
};

const ResultsPage: React.FC<{
  weapons: WeaponQueryResult;
}> = (props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl p-4">Results</h2>
      <div className="p-2" />
      <div className="flex flex-col w-full max-w-2xl border">
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
