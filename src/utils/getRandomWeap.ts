export const getRandomWeapon: (antiDupe?: number) => number = (antiDupe) => {
  const allWeaponSets = [
    [20959, 20974],
    [22868, 22883],
    [28289, 28306],
    [36943, 36962],
  ];
  const weaponSet =
    allWeaponSets[Math.floor(Math.random() * allWeaponSets.length)];

  if (!weaponSet || !weaponSet[0] || !weaponSet[1]) {
    return 0;
  }

  const weaponId =
    Math.floor(Math.random() * (weaponSet[1] - weaponSet[0] + 1)) +
    weaponSet[0];

  // Don't return a duplicate for 2nd weapon
  if (weaponId !== antiDupe) return weaponId;
  return getRandomWeapon(antiDupe);
};

export const getOptionsForVote = () => {
  const firstId = getRandomWeapon();
  const secondId = getRandomWeapon(firstId);

  return [firstId, secondId];
};

// UCoB
// 20959 - 20974 (16)
// UWU
// 22868 - 22883 (16)
// TEA
// 28289 - 28306 (18)
// DSR
// 36943 - 36962 (20)
