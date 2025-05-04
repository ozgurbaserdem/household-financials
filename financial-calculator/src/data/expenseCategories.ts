export const expenseCategories = [
  {
    id: 'home',
    name: 'Home',
    subcategories: [
      { id: 'electricity-heating', name: 'Electricity and heating' },
      { id: 'pets', name: 'Pets' },
      { id: 'streaming-internet-phone', name: 'Streaming services, internet and phone' },
      { id: 'house-cleaning', name: 'House cleaning' },
      { id: 'rent-monthly-fee', name: 'Rent and monthly fee' },
      { id: 'interior-decoration', name: 'Interior decoration and furnishing' },
      { id: 'mortgage', name: 'Mortgage' },
      { id: 'home-improvements', name: 'Home improvements and renovation' },
      { id: 'holiday-home', name: 'Holiday home' },
      { id: 'water-garbage', name: 'Water and garbage collection' },
      { id: 'gardening', name: 'Gardening' },
      { id: 'home-alarm', name: 'Home alarm' },
      { id: 'other-household', name: 'Other household services' }
    ]
  },
  {
    id: 'car-transportation',
    name: 'Car and transportation',
    subcategories: [
      { id: 'charging', name: 'Charging' },
      { id: 'parking', name: 'Parking' },
      { id: 'fuel', name: 'Fuel' },
      { id: 'car-service', name: 'Car service' },
      { id: 'taxi', name: 'Taxi' },
      { id: 'public-transportation', name: 'Public transportation' },
      { id: 'car-cleaning', name: 'Car cleaning' },
      { id: 'car-loan-lease', name: 'Car loan and car lease' },
      { id: 'motorcycle', name: 'Motorcycle' },
      { id: 'other-transportation', name: 'Other car and transportation' }
    ]
  },
  {
    id: 'leisure',
    name: 'Leisure time',
    subcategories: [
      { id: 'association-memberships', name: 'Association memberships' },
      { id: 'golfing', name: 'Golfing' },
      { id: 'hunting', name: 'Hunting' },
      { id: 'hiking-outdoor', name: 'Hiking and outdoor activities' },
      { id: 'arts-crafts', name: 'Arts and crafts' },
      { id: 'dancing', name: 'Dancing' },
      { id: 'skiing-winter', name: 'Skiing and winter sports' },
      { id: 'horseback-riding', name: 'Horseback riding' },
      { id: 'biking', name: 'Biking' },
      { id: 'photographing', name: 'Photographing' },
      { id: 'music-instruments', name: 'Music and instruments' },
      { id: 'parties-celebrations', name: 'Parties and celebrations' },
      { id: 'charities', name: 'Charities' },
      { id: 'movies-events', name: 'Movies, theaters and events' },
      { id: 'lotteries-betting', name: 'Lotteries and betting' },
      { id: 'bars-nightclubs', name: 'Bars, pubs and nightclubs' }
    ]
  },
  {
    id: 'shopping-services',
    name: 'Shopping and services',
    subcategories: [
      { id: 'flowers-decor', name: 'Flowers and minor home decorating items' },
      { id: 'electronics', name: 'Home electronics' },
      { id: 'books-games', name: 'Books and games' },
      { id: 'music-apps', name: 'Music and apps' },
      { id: 'subscriptions-media', name: 'Subscriptions and media' },
      { id: 'clothes-shoes', name: 'Clothes and shoes' },
      { id: 'dry-clean-tailor', name: 'Dry clean and tailor' },
      { id: 'jewelry-accessories', name: 'Jewelery and accessories' },
      { id: 'tobacco', name: 'Tobacco' },
      { id: 'alcohol', name: 'Alcohol' },
      { id: 'gifts', name: 'Gifts' },
      { id: 'shopping-other', name: 'Shopping and Services, other' }
    ]
  },
  {
    id: 'loans-tax-fees',
    name: 'Loans, tax and fees',
    subcategories: [
      { id: 'late-fees', name: 'Late fees and charges' },
      { id: 'bank-fees', name: 'Bank and service fees' },
      { id: 'private-loans', name: 'Private loans' },
      { id: 'tax-payments', name: 'Tax payments' },
      { id: 'other-loans-fees', name: 'Other loans, taxes and fees' }
    ]
  },
  {
    id: 'health-beauty',
    name: 'Health and beauty',
    subcategories: [
      { id: 'pharmacy', name: 'Pharmacy' },
      { id: 'healthcare', name: 'Healthcare' },
      { id: 'sports-exercise', name: 'Sports and exercise' },
      { id: 'spa-massage', name: 'Spa and massage' },
      { id: 'beauty-products', name: 'Beauty products' },
      { id: 'hairdresser', name: 'Hairdresser' },
      { id: 'optician', name: 'Optician' },
      { id: 'other-health-beauty', name: 'Other health and beauty' }
    ]
  },
  {
    id: 'children',
    name: 'Children',
    subcategories: [
      { id: 'babysitting', name: 'Babysitting' },
      { id: 'children-clothing', name: 'Children\'s clothing' },
      { id: 'children-toys', name: 'Children\'s toys' },
      { id: 'allowance', name: 'Weekly and monthly allowance' },
      { id: 'children-activities', name: 'Children\'s activities' },
      { id: 'childcare-products', name: 'Childcare products' },
      { id: 'alimony', name: 'Alimony' },
      { id: 'preschool-after-school', name: 'Preschool and after school center' },
      { id: 'children-other', name: 'Children, other' }
    ]
  },
  {
    id: 'uncategorized',
    name: 'Uncategorised expenses',
    subcategories: [
      { id: 'cash-withdrawals', name: 'Cash withdrawals' },
      { id: 'swish', name: 'Swish' },
      { id: 'uncategorized-transfers', name: 'Uncategorised transfers' },
      { id: 'uncategorized-other', name: 'Uncategorised expenses other' },
      { id: 'uncategorized-credit-card', name: 'Uncategorised credit card purchases' }
    ]
  },
  {
    id: 'insurance',
    name: 'Insurance',
    subcategories: [
      { id: 'household-insurance', name: 'Household insurance' },
      { id: 'car-insurance', name: 'Car insurance' },
      { id: 'life-health-insurance', name: 'Life and health insurance' },
      { id: 'income-insurance', name: 'A-kassa and/or income insurance' },
      { id: 'accident-insurance', name: 'Accident insurance' },
      { id: 'insurance-other', name: 'Insurance other' }
    ]
  },
  {
    id: 'savings-investments',
    name: 'Savings and investments',
    subcategories: [
      { id: 'savings-buffer', name: 'Savings buffer' },
      { id: 'pension-savings', name: 'Pension savings' },
      { id: 'securities-funds', name: 'Securities and fund savings' },
      { id: 'savings-children', name: 'Savings children' },
      { id: 'savings-other', name: 'Savings other' }
    ]
  },
  {
    id: 'vacation-traveling',
    name: 'Vacation and travelling',
    subcategories: [
      { id: 'vacation-transport', name: 'Planes, trains and cars on vacation' },
      { id: 'hotels-accommodation', name: 'Hotels and accomodation' },
      { id: 'vacation-entertainment', name: 'Entertainment on vacation' },
      { id: 'vacation-food', name: 'Vacation food and living expenses' },
      { id: 'vacation-other', name: 'Vacation and travelling other' }
    ]
  },
  {
    id: 'education',
    name: 'Education',
    subcategories: [
      { id: 'student-loan', name: 'Student loan' },
      { id: 'education-fees', name: 'Education fees' },
      { id: 'educational-equipment', name: 'Educational equipment' },
      { id: 'education-other', name: 'Education other' }
    ]
  },
  {
    id: 'food',
    name: 'Food',
    subcategories: [
      { id: 'groceries', name: 'Groceries' },
      { id: 'fast-food', name: 'Fast food' },
      { id: 'candy-kiosks', name: 'Candy, ice cream and kiosks' },
      { id: 'restaurants-cafes', name: 'Restaurants and cafes' },
      { id: 'food-other', name: 'Other foods' }
    ]
  }
] as const

export type ExpenseCategory = typeof expenseCategories[number]
export type ExpenseSubcategory = ExpenseCategory['subcategories'][number]

export const DEFAULT_EXPENSES: Record<string, Record<string, number>> = {
  home: {
    'electricity-heating': 0,
    'pets': 0,
    'streaming-internet-phone': 0,
    'house-cleaning': 0,
    'rent-monthly-fee': 0,
    'interior-decoration': 0,
    'mortgage': 0,
    'home-improvements': 0,
    'holiday-home': 0,
    'water-garbage': 0,
    'gardening': 0,
    'home-alarm': 0,
    'other-household': 0
  },
  'car-transportation': {
    'charging': 0,
    'parking': 0,
    'fuel': 0,
    'car-service': 0,
    'taxi': 0,
    'public-transportation': 0,
    'car-cleaning': 0,
    'car-loan-lease': 0,
    'motorcycle': 0,
    'other-transportation': 0
  },
  leisure: {
    'association-memberships': 0,
    'golfing': 0,
    'hunting': 0,
    'hiking-outdoor': 0,
    'arts-crafts': 0,
    'dancing': 0,
    'skiing-winter': 0,
    'horseback-riding': 0,
    'biking': 0,
    'photographing': 0,
    'music-instruments': 0,
    'parties-celebrations': 0,
    'charities': 0,
    'movies-events': 0,
    'lotteries-betting': 0,
    'bars-nightclubs': 0
  },
  'shopping-services': {
    'flowers-decor': 0,
    'electronics': 0,
    'books-games': 0,
    'music-apps': 0,
    'subscriptions-media': 0,
    'clothes-shoes': 0,
    'dry-clean-tailor': 0,
    'jewelry-accessories': 0,
    'tobacco': 0,
    'alcohol': 0,
    'gifts': 0,
    'shopping-other': 0
  },
  'loans-tax-fees': {
    'late-fees': 0,
    'bank-fees': 0,
    'private-loans': 0,
    'tax-payments': 0,
    'other-loans-fees': 0
  },
  'health-beauty': {
    'pharmacy': 0,
    'healthcare': 0,
    'sports-exercise': 0,
    'spa-massage': 0,
    'beauty-products': 0,
    'hairdresser': 0,
    'optician': 0,
    'other-health-beauty': 0
  },
  children: {
    'babysitting': 0,
    'children-clothing': 0,
    'children-toys': 0,
    'allowance': 0,
    'children-activities': 0,
    'childcare-products': 0,
    'alimony': 0,
    'preschool-after-school': 0,
    'children-other': 0
  },
  uncategorized: {
    'cash-withdrawals': 0,
    'swish': 0,
    'uncategorized-transfers': 0,
    'uncategorized-other': 0,
    'uncategorized-credit-card': 0
  },
  insurance: {
    'household-insurance': 0,
    'car-insurance': 0,
    'life-health-insurance': 0,
    'income-insurance': 0,
    'accident-insurance': 0,
    'insurance-other': 0
  },
  'savings-investments': {
    'savings-buffer': 0,
    'pension-savings': 0,
    'securities-funds': 0,
    'savings-children': 0,
    'savings-other': 0
  },
  'vacation-traveling': {
    'vacation-transport': 0,
    'hotels-accommodation': 0,
    'vacation-entertainment': 0,
    'vacation-food': 0,
    'vacation-other': 0
  },
  education: {
    'student-loan': 0,
    'education-fees': 0,
    'educational-equipment': 0,
    'education-other': 0
  },
  food: {
    'groceries': 0,
    'fast-food': 0,
    'candy-kiosks': 0,
    'restaurants-cafes': 0,
    'food-other': 0
  }
} 