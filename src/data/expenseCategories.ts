export const expenseCategories = [
  {
    id: "home",
    name: "Home",
  },
  {
    id: "carTransportation",
    name: "Car and transportation",
  },
  {
    id: "leisure",
    name: "Leisure time",
  },
  {
    id: "shoppingServices",
    name: "Shopping and services",
  },
  {
    id: "loansTaxFees",
    name: "Loans, tax and fees",
  },
  {
    id: "healthBeauty",
    name: "Health and beauty",
  },
  {
    id: "children",
    name: "Children",
  },
  {
    id: "uncategorized",
    name: "Uncategorised expenses",
  },
  {
    id: "insurance",
    name: "Insurance",
  },
  {
    id: "savingsInvestments",
    name: "Savings and investments",
  },
  {
    id: "vacationTraveling",
    name: "Vacation and travelling",
  },
  {
    id: "education",
    name: "Education",
  },
  {
    id: "food",
    name: "Food",
  },
] as const;

export type ExpenseCategory = (typeof expenseCategories)[number];

export const DEFAULT_EXPENSES: Record<string, number> = {
  home: 0,
  carTransportation: 0,
  leisure: 0,
  shoppingServices: 0,
  loansTaxFees: 0,
  healthBeauty: 0,
  children: 0,
  uncategorized: 0,
  insurance: 0,
  savingsInvestments: 0,
  vacationTraveling: 0,
  education: 0,
  food: 0,
};
