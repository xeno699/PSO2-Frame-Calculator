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
  // power/frame の効率でソート
  const sortedActions = actions.sort((a, b) => b.power / b.frames - a.power / a.frames);

  const combinations: Combination[] = [];

  const findCombinations = (
    currentActions: Action[],
    remainingFrames: number,
    currentPower: number,
    usageCount: Map<string, number>, // 使用回数トラッキング
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
      const used = usageCount.get(action.name) ?? 0;

      if (
        action.frames <= remainingFrames &&
        used < action.maxUsage // 使用回数制限チェック
      ) {
        usageCount.set(action.name, used + 1);

        // i をそのまま渡すことで「同じアクションを複数回選択」できる
        findCombinations(
          [...currentActions, action],
          remainingFrames - action.frames,
          currentPower + action.power,
          usageCount,
          i
        );

        usageCount.set(action.name, used); // backtrack
      }
    }
  };

  findCombinations([], frameLimit, 0, new Map(), 0);

  const topCombinations = combinations.sort((a, b) => b.totalPower - a.totalPower).slice(0, 5);

  return { combinations: topCombinations };
};
