export interface CompoundInterestInputs {
  startSum: number;
  monthlySavings: number;
  yearlyReturn: number; // decimal (0.07 for 7%)
  investmentHorizon: number; // years (1-50)
}

export interface CompoundInterestData {
  year: number;
  startSum: number;
  accumulatedSavings: number;
  compoundReturns: number;
  totalValue: number;
}

export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestData[] {
  const { startSum, monthlySavings, yearlyReturn, investmentHorizon } = inputs;

  // yearlyReturn is already a decimal (0.07 for 7%)
  const yearlyReturnDecimal = yearlyReturn;

  // Monthly return rate
  const monthlyReturnRate = Math.pow(1 + yearlyReturnDecimal, 1 / 12) - 1;

  const data: CompoundInterestData[] = [];

  let currentValue = startSum;
  let totalSavings = 0;

  for (let year = 1; year <= investmentHorizon; year++) {
    // Calculate monthly compound growth for this year
    for (let month = 1; month <= 12; month++) {
      // Apply monthly return to current value
      currentValue = currentValue * (1 + monthlyReturnRate);

      // Add monthly savings
      currentValue += monthlySavings;
      totalSavings += monthlySavings;
    }

    // Calculate breakdown for this year
    const accumulatedSavings = totalSavings;
    const compoundReturns = Math.max(
      0,
      currentValue - startSum - accumulatedSavings
    );

    data.push({
      year,
      startSum,
      accumulatedSavings,
      compoundReturns,
      totalValue: currentValue,
    });
  }

  return data;
}

export function calculateFinalValues(inputs: CompoundInterestInputs) {
  const data = calculateCompoundInterest(inputs);
  const finalYear = data[data.length - 1];

  if (!finalYear) {
    return {
      totalValue: inputs.startSum,
      startSum: inputs.startSum,
      totalSavings: 0,
      totalReturns: 0,
    };
  }

  return {
    totalValue: finalYear.totalValue,
    startSum: finalYear.startSum,
    totalSavings: finalYear.accumulatedSavings,
    totalReturns: finalYear.compoundReturns,
  };
}
