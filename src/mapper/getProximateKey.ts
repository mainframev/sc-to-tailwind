export const removeUnits = (value: string) => Number(value.replace(/rem|px|em/gm, ""));

// Get the nearest matching Tailwind value
function getProximateKey(valueHash: Record<string, string>, value: string) {
  const values = Object.keys(valueHash).map(v => removeUnits(v));
  const parsedValue = removeUnits(value);

  let distance = Math.abs(values[0] - parsedValue);
  let idx = 0;

  values.forEach((v, i) => {
    const currentDistance = Math.abs(v - parsedValue);
    if (currentDistance < distance) {
      idx = i;
      distance = currentDistance;
    }
  });

  return values[idx] > 0 ? `${values[idx]}rem` : "0";
}

export default getProximateKey;
