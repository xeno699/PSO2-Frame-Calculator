interface Action {
  name: string;
  frames: number;
  power: number;
  maxUsage: number; // 追加
}

interface Combination {
  actions: Action[];
  totalPower: number;
  totalFrames: number;
  remainingFrames: number;
}

interface OptimalResult {
  combinations: Combination[];
}

/**
 * Calculates the top combinations of actions to maximize power within the given frame limit.
 * @param frameLimit - The maximum number of frames available.
 * @param actions - The list of actions to choose from.
 * @returns The top combinations of actions ranked by total power.
 */
export const calculateOptimalActions = (frameLimit: number, actions: Action[]): OptimalResult => {
  const K = 5;

  // dp[f] will store top K combinations for f frames used
  const dp: Combination[][] = Array(frameLimit + 1)
    .fill(null)
    .map(() => []);

  // initialize dp[0] with empty combination
  dp[0].push({ actions: [], totalPower: 0, totalFrames: 0, remainingFrames: frameLimit });

  for (const action of actions) {
    for (let f = frameLimit; f >= action.frames; f--) {
      const candidates: Combination[] = [];

      for (const comb of dp[f - action.frames]) {
        const usageCount = new Map<string, number>();
        comb.actions.forEach((a) => usageCount.set(a.name, (usageCount.get(a.name) ?? 0) + 1));

        if ((usageCount.get(action.name) ?? 0) < action.maxUsage) {
          // create a new combination by adding current action
          const newComb: Combination = {
            actions: [...comb.actions, action],
            totalPower: comb.totalPower + action.power,
            totalFrames: comb.totalFrames + action.frames,
            remainingFrames: frameLimit - (comb.totalFrames + action.frames),
          };
          candidates.push(newComb);
        }
      }

      // merge existing combinations with new candidates
      const allCombs = [...dp[f], ...candidates];
      // sort by totalPower descending and keep top K
      dp[f] = allCombs.sort((a, b) => b.totalPower - a.totalPower).slice(0, K);
    }
  }

  // collect all top combinations across all frame counts
  const allTop: Combination[] = dp.flat();
  const uniqueTop = allTop.sort((a, b) => b.totalPower - a.totalPower).slice(0, K);

  return { combinations: uniqueTop };
};
