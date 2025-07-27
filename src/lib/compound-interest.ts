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

export const calculateCompoundInterest = (
  inputs: CompoundInterestInputs
): CompoundInterestData[] => {
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

  const processYear = (
    year: number,
    prevState: {
      currentValue: number;
      totalSavings: number;
      currentMonthlySavings: number;
      totalWithdrawn: number;
    }
  ) => {
    // Check if we're in withdrawal phase (from withdrawal year onwards)
    const isWithdrawalPhase =
      withdrawalType !== "none" &&
      withdrawalYear !== undefined &&
      year >= withdrawalYear;

    // Handle withdrawal at the beginning of the year if we're in withdrawal phase
    const withdrawal = (() => {
      if (!isWithdrawalPhase) return 0;

      // Withdrawal happens at the beginning of each year in the withdrawal phase
      if (withdrawalType === "percentage" && withdrawalPercentage) {
        return prevState.currentValue * (withdrawalPercentage / 100);
      } else if (withdrawalType === "amount" && withdrawalAmount) {
        return Math.min(withdrawalAmount, prevState.currentValue); // Can't withdraw more than available
      }
      return 0;
    })();

    // Apply withdrawal at the beginning of the year (before growth)
    const currentValueAfterWithdrawal = prevState.currentValue - withdrawal;
    const newTotalWithdrawn = prevState.totalWithdrawn + withdrawal;

    // Update monthly savings based on annual increase (only if not in withdrawal phase)
    const updatedMonthlySavings =
      year > 1 && annualSavingsIncrease > 0 && !isWithdrawalPhase
        ? prevState.currentMonthlySavings * (1 + annualSavingsIncrease / 100)
        : prevState.currentMonthlySavings;

    // Calculate monthly compound growth for this year

    const monthlyResults = Array.from(
      { length: 12 },
      (_, monthIndex) => monthIndex + 1
      // eslint-disable-next-line unicorn/no-array-reduce
    ).reduce(
      (acc) => {
        // Apply monthly return to current value
        const newValue = acc.value * (1 + monthlyReturnRate);

        // Add monthly savings only if not in withdrawal phase
        if (!isWithdrawalPhase) {
          return {
            value: newValue + updatedMonthlySavings,
            totalSavings: acc.totalSavings + updatedMonthlySavings,
          };
        }

        return { value: newValue, totalSavings: acc.totalSavings };
      },
      {
        value: currentValueAfterWithdrawal,
        totalSavings: prevState.totalSavings,
      }
    );

    const currentValue = monthlyResults.value;
    const totalSavings = monthlyResults.totalSavings;

    // Calculate breakdown for this year
    const accumulatedSavings = totalSavings;
    const compoundReturns = Math.max(
      0,
      currentValue + newTotalWithdrawn - startSum - accumulatedSavings
    );

    // Calculate chart values for proper visualization
    // During withdrawal phase, we need to show the current portfolio composition
    // not the accumulated historical values
    const getChartValues = () => {
      const base = {
        chartStartSum: startSum,
        chartSavings: accumulatedSavings,
        chartReturns: compoundReturns,
      };

      // If we're in withdrawal phase, adjust the chart values to show current portfolio
      if (isWithdrawalPhase && currentValue > 0) {
        // Initial investment remains constant - it doesn't get "withdrawn"
        const adjustedChartStartSum = Math.min(startSum, currentValue);

        // Calculate how much of current portfolio is from savings vs returns
        const remainingValue = Math.max(
          0,
          currentValue - adjustedChartStartSum
        );
        const totalSavingsAndReturns = accumulatedSavings + compoundReturns;

        if (totalSavingsAndReturns > 0 && remainingValue > 0) {
          const savingsRatio = accumulatedSavings / totalSavingsAndReturns;
          const returnsRatio = compoundReturns / totalSavingsAndReturns;

          return {
            chartStartSum: adjustedChartStartSum,
            chartSavings: remainingValue * savingsRatio,
            chartReturns: remainingValue * returnsRatio,
          };
        } else {
          return {
            chartStartSum: adjustedChartStartSum,
            chartSavings: 0,
            chartReturns: remainingValue,
          };
        }
      }

      return base;
    };

    const { chartStartSum, chartSavings, chartReturns } = getChartValues();

    const yearData: CompoundInterestData = {
      year,
      startSum,
      accumulatedSavings,
      compoundReturns,
      totalValue: currentValue,
      withdrawal: withdrawal > 0 ? withdrawal : undefined,
      currentMonthlySavings: isWithdrawalPhase
        ? 0
        : Math.round(updatedMonthlySavings),
      userAge: age ? age + year : undefined,
      chartStartSum: isWithdrawalPhase ? 0 : chartStartSum,
      chartSavings: isWithdrawalPhase ? 0 : chartSavings,
      chartReturns: isWithdrawalPhase ? 0 : chartReturns,
      portfolioValue: isWithdrawalPhase ? currentValue : undefined,
      isWithdrawalPhase,
      withdrawalPhaseValue: isWithdrawalPhase ? currentValue : undefined,
    };

    return {
      data: yearData,
      newState: {
        currentValue,
        totalSavings,
        currentMonthlySavings: updatedMonthlySavings,
        totalWithdrawn: newTotalWithdrawn,
      },
    };
  };

  const result = Array.from(
    { length: investmentHorizon },
    (_, index) => index + 1
    // eslint-disable-next-line unicorn/no-array-reduce
  ).reduce(
    (acc, year) => {
      const yearResult = processYear(year, acc.state);
      return {
        data: [...acc.data, yearResult.data],
        state: yearResult.newState,
      };
    },
    {
      data: [] as CompoundInterestData[],
      state: {
        currentValue: startSum,
        totalSavings: 0,
        currentMonthlySavings: initialMonthlySavings,
        totalWithdrawn: 0,
      },
    }
  );

  return result.data;
};

export const calculateFinalValues = (
  inputs: CompoundInterestInputs
): FinalValues => {
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
};

// Helper function to calculate 20-year wealth projection for CTA
export const calculateWealthProjection = (
  monthlySavings: number,
  currentBuffer: number = 0
): number => {
  const inputs: CompoundInterestInputs = {
    startSum: currentBuffer,
    monthlySavings,
    yearlyReturn: 0.07, // 7% annual return
    investmentHorizon: 20, // 20 years
  };

  const finalValues = calculateFinalValues(inputs);
  return finalValues.totalValue;
};
