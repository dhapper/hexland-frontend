export function canAfford(cost, resources) {
  if (!cost || !resources) {
    console.warn("[canAfford] Missing cost or resources", { cost, resources });
    return false;
  }

  console.log("[canAfford] Checking affordability");
  console.log("[canAfford] Cost:", cost);
  console.log("[canAfford] Player resources:", resources);

  for (const [res, amt] of Object.entries(cost)) {
    const owned = resources[res] ?? 0;

    console.log(
      `[canAfford] Resource check → ${res}: need ${amt}, have ${owned}`
    );

    if (owned < amt) {
      console.log("[canAfford] ❌ Cannot afford");
      return false;
    }
  }

  console.log("[canAfford] ✅ Can afford");
  return true;
}
