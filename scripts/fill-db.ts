import Prisma1, * as Prisma2 from "@prisma/client";
import fetch from "node-fetch";

const Prisma = Prisma1 || Prisma2;
export const prisma = new Prisma.PrismaClient();

const doBackfill = async () => {
  const ucob = await queryAPI(20959, 20974);
  const uwu = await queryAPI(22868, 22883);
  const tea = await queryAPI(28289, 28306);
  const dsr = await queryAPI(36943, 36962);

  // TODO: merge? for now just do them individually
  addWeaponsToDb(ucob.Results);
  addWeaponsToDb(uwu.Results);
  addWeaponsToDb(tea.Results);
  addWeaponsToDb(dsr.Results);
  

};

const addWeaponsToDb = async (weaponSet: { ID: number; Name: string; ClassJobCategory: { Name: string; }; IconHD: string; }[]) => {
  console.log(`Formatting data set...`)
  const formattedWeapons = weaponSet.map(
    (w: {
      ID: number;
      Name: string;
      ClassJobCategory: { Name: string };
      IconHD: string;
    }) => ({
      id: w.ID,
      name: w.Name,
      job: w.ClassJobCategory.Name,
      iconUrl: `https://xivapi.com${w.IconHD}`,
    })
  );
  
  console.log(`Attempting to add to DB...`)
  const creation = await prisma.weapon.createMany({
    data: formattedWeapons,
  });

  console.log("Creation?", creation);
};

const queryAPI = async (first: number, last: number) => {
  console.log(`Querying API for range: ${first}-${last}`)
  const response = await fetch(
    `https://xivapi.com/search?indexes=Item&filters=ID%3E=${first},ID%3C=${last}&columns=ID,Name,IconHD,ClassJobCategory.Name`
  ).then((response) => response.json());

  return response;
};

doBackfill();

// UCOB: https://xivapi.com/search?indexes=Item&filters=ID%3E=20959,ID%3C=20974&columns=ID,Name,IconHD,ClassJobCategory.Name
// UWU: https://xivapi.com/search?indexes=Item&filters=ID%3E=22868,ID%3C=22883&columns=ID,Name,IconHD,ClassJobCategory.Name
// TEA: https://xivapi.com/search?indexes=Item&filters=ID%3E=28289,ID%3C=28306&columns=ID,Name,IconHD,ClassJobCategory.Name
// DSR: https://xivapi.com/search?indexes=Item&filters=ID%3E=36943,ID%3C=36962&columns=ID,Name,IconHD,ClassJobCategory.Name
