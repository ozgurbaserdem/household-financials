export interface CompoundInterestInputs {
  startSum: number;
  monthlySavings: number;
  yearlyReturn: number; // decimal (0.07 for 7%)
  investmentHorizon: number; // years (1-50)
  age?: number; // Current age of the user
  // Advanced settings
  withdrawalYear?: number; // Year to make withdrawal
  withdrawalAmount?: number; // Fixed amount to withdraw
  withdrawalPercentage?: number; // Percentage of total value to withdraw (0-100)
  withdrawalType?: "amount" | "percentage" | "none";
  annualSavingsIncrease?: number; // Percentage increase per year (0-100)
}

export interface CompoundInterestData {
  year: number;
  startSum: number;
  accumulatedSavings: number;
  compoundReturns: number;
  totalValue: number;
  withdrawal?: number; // Amount withdrawn this year
  currentMonthlySavings?: number; // Current monthly savings after increase
  userAge?: number; // User's age at this year
  // Chart display values (for proper visualization during withdrawal phase)
  chartStartSum: number;
  chartSavings: number;
  chartReturns: number;
  // Single value for withdrawal phase
  portfolioValue?: number;
  isWithdrawalPhase?: boolean;
  withdrawalPhaseValue?: number; // Value to show as single green bar during withdrawal phase
}

export interface FinalValues {
  totalValue: number; // Current portfolio value after withdrawals
  theoreticalTotalValue: number; // What portfolio would be worth without withdrawals
  startSum: number;
  totalSavings: number;
  totalReturns: number;
  totalWithdrawn: number;
}

export function calculateCompoundInterest(
  inputs: CompoundInterestInputs
): CompoundInterestData[] {
  const {
    startSum,
    monthlySavings: initialMonthlySavings,
    yearlyReturn,
    investmentHorizon,
    age,
    withdrawalYear,
    withdrawalAmount,
    withdrawalPercentage,
    withdrawalType = "none",
    annualSavingsIncrease = 0,
  } = inputs;

  // yearlyReturn is already a decimal (0.07 for 7%)
  const yearlyReturnDecimal = yearlyReturn;

  // Monthly return rate
  const monthlyReturnRate = Math.pow(1 + yearlyReturnDecimal, 1 / 12) - 1;

  const data: CompoundInterestData[] = [];

  let currentValue = startSum;
  let totalSavings = 0;
  let currentMonthlySavings = initialMonthlySavings;
  let totalWithdrawn = 0;

  for (let year = 1; year <= investmentHorizon; year++) {
    // Check if we're in withdrawal phase (from withdrawal year onwards)
    const isWithdrawalPhase =
      withdrawalType !== "none" &&
      withdrawalYear !== undefined &&
      year >= withdrawalYear;

    // Handle withdrawal at the beginning of the year if we're in withdrawal phase
    let withdrawal = 0;
    if (isWithdrawalPhase) {
      // Withdrawal happens at the beginning of each year in the withdrawal phase
      if (withdrawalType === "percentage" && withdrawalPercentage) {
        withdrawal = currentValue * (withdrawalPercentage / 100);
      } else if (withdrawalType === "amount" && withdrawalAmount) {
        withdrawal = Math.min(withdrawalAmount, currentValue); // Can't withdraw more than available
      }

      // Apply withdrawal at the beginning of the year (before growth)
      currentValue -= withdrawal;
      totalWithdrawn += withdrawal;
    }

    // Update monthly savings based on annual increase (only if not in withdrawal phase)
    if (year > 1 && annualSavingsIncrease > 0 && !isWithdrawalPhase) {
      currentMonthlySavings =
        currentMonthlySavings * (1 + annualSavingsIncrease / 100);
    }

    // Calculate monthly compound growth for this year
    for (let month = 1; month <= 12; month++) {
      // Apply monthly return to current value
      currentValue = currentValue * (1 + monthlyReturnRate);

      // Add monthly savings only if not in withdrawal phase
      if (!isWithdrawalPhase) {
        currentValue += currentMonthlySavings;
        totalSavings += currentMonthlySavings;
      }
    }

    // Calculate breakdown for this year
    const accumulatedSavings = totalSavings;
    const compoundReturns = Math.max(
      0,
      currentValue + totalWithdrawn - startSum - accumulatedSavings
    );

    // Calculate chart values for proper visualization
    // During withdrawal phase, we need to show the current portfolio composition
    // not the accumulated historical values
    let chartStartSum = startSum;
    let chartSavings = accumulatedSavings;
    let chartReturns = compoundReturns;

    // If we're in withdrawal phase, adjust the chart values to show current portfolio
    if (isWithdrawalPhase && currentValue > 0) {
      // Initial investment remains constant - it doesn't get "withdrawn"
      chartStartSum = Math.min(startSum, currentValue);

      // Calculate how much of current portfolio is from savings vs returns
      const remainingValue = Math.max(0, currentValue - chartStartSum);
      const totalSavingsAndReturns = accumulatedSavings + compoundReturns;

      if (totalSavingsAndReturns > 0 && remainingValue > 0) {
        const savingsRatio = accumulatedSavings / totalSavingsAndReturns;
        const returnsRatio = compoundReturns / totalSavingsAndReturns;

        chartSavings = remainingValue * savingsRatio;
        chartReturns = remainingValue * returnsRatio;
      } else {
        chartSavings = 0;
        chartReturns = remainingValue;
      }
    }

    data.push({
      year,
      startSum,
      accumulatedSavings,
      compoundReturns,
      totalValue: currentValue,
      withdrawal: withdrawal > 0 ? withdrawal : undefined,
      currentMonthlySavings: isWithdrawalPhase
        ? 0
        : Math.round(currentMonthlySavings),
      userAge: age ? age + year : undefined,
      chartStartSum: isWithdrawalPhase ? 0 : chartStartSum,
      chartSavings: isWithdrawalPhase ? 0 : chartSavings,
      chartReturns: isWithdrawalPhase ? 0 : chartReturns,
      portfolioValue: isWithdrawalPhase ? currentValue : undefined,
      isWithdrawalPhase,
      withdrawalPhaseValue: isWithdrawalPhase ? currentValue : undefined,
    });
  }

  return data;
}

export function calculateFinalValues(
  inputs: CompoundInterestInputs
): FinalValues {
  const data = calculateCompoundInterest(inputs);
  const finalYear = data[data.length - 1];

  if (!finalYear) {
    return {
      totalValue: inputs.startSum,
      theoreticalTotalValue: inputs.startSum,
      startSum: inputs.startSum,
      totalSavings: 0,
      totalReturns: 0,
      totalWithdrawn: 0,
    };
  }

  // Calculate total withdrawals across all years
  const totalWithdrawn = data.reduce(
    (sum, year) => sum + (year.withdrawal || 0),
    0
  );

  // Calculate theoretical total value (what it would be without withdrawals)
  const theoreticalTotalValue = finalYear.totalValue + totalWithdrawn;

  return {
    totalValue: finalYear.totalValue, // Current portfolio value after withdrawals
    theoreticalTotalValue, // What it would be worth without withdrawals
    startSum: finalYear.startSum, // Keep original start sum
    totalSavings: finalYear.accumulatedSavings, // Show total historical savings
    totalReturns: finalYear.compoundReturns, // Show total historical returns
    totalWithdrawn, // Add total withdrawals
  };
}
