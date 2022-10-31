// TODO: figure out where ulti weapons and relic weapons are
const MAX_CHAR_ID = 6015386;

export const getRandomWeapon: (notThisOne?: number) => number = (
  notThisOne
) => {
  const weaponNumber = Math.floor(Math.random() * MAX_CHAR_ID) + 1;

  if (weaponNumber !== notThisOne) return weaponNumber;
  return getRandomWeapon(notThisOne);
};

export const getOptionsForVote = () => {
  const firstId = getRandomWeapon();
  const secondId = getRandomWeapon(firstId);

  return [firstId, secondId];
}