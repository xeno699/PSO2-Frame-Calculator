interface Action {
  name: string;
  frames: number;
  power: number;
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
export const calculateOptimalActions = (
  frameLimit: number,
  actions: Action[]
): OptimalResult => {
  // Sort actions by power-to-frame ratio in descending order
  const sortedActions = actions.sort((a, b) => (b.power / b.frames) - (a.power / a.frames));

  const combinations: Combination[] = [];

  const findCombinations = (
    currentActions: Action[],
    remainingFrames: number,
    currentPower: number,
    startIndex: number
  ) => {
    combinations.push({
      actions: [...currentActions],
      totalPower: currentPower,
      totalFrames: frameLimit - remainingFrames,
      remainingFrames,
    });

    for (let i = startIndex; i < sortedActions.length; i++) {
      const action = sortedActions[i];
      if (action.frames <= remainingFrames) {
        findCombinations(
          [...currentActions, action],
          remainingFrames - action.frames,
          currentPower + action.power,
          i + 1
        );
      }
    }
  };

  findCombinations([], frameLimit, 0, 0);

  // Sort combinations by total power in descending order and return top 5
  const topCombinations = combinations
    .sort((a, b) => b.totalPower - a.totalPower)
    .slice(0, 5);

  return { combinations: topCombinations };
};