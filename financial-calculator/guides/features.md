# Financial Calculator Features

## Core Features

### 1. Loan Calculator
**Description**: Calculate monthly payments based on loan amount, interest rates, and amortization rates.

**Requirements**:
- Input field for loan amount (default: 9,000,000 SEK)
- Multiple interest rate selection (3.5%, 4.0%, 4.5%, 5.0%, 5.5%)
- Multiple amortization rate selection (2%, 3%)
- Calculate monthly interest payment
- Calculate monthly amortization payment
- Show total housing cost including running costs

**Technical Implementation**:
- Use form with validation
- Support multiple selections for rates
- Real-time calculation updates
- Currency formatting for Swedish krona

### 2. Income Management
**Description**: Handle household income input and calculations.

**Requirements**:
- Input for minimum net income (default: 105,000 SEK/month)
- Input for maximum net income (default: 107,000 SEK/month)
- Support range-based calculations
- Validate income inputs

**Technical Implementation**:
- Form validation for numeric inputs
- Range validation (max >= min)
- Format as Swedish currency

### 3. Expense Tracking System
**Description**: Comprehensive expense categorization and tracking across 13 main categories.

**Main Categories**:
1. Home
2. Car and transportation
3. Leisure time
4. Shopping and services
5. Loans, tax and fees
6. Health and beauty
7. Children
8. Uncategorised expenses
9. Insurance
10. Savings and investments
11. Vacation and travelling
12. Education
13. Food

**Requirements**:
- Accordion-style UI for categories
- Input fields for each subcategory
- Running totals per category
- Grand total of all expenses
- Default values (0) for all fields
- Support for decimal inputs

**Technical Implementation**:
- Hierarchical data structure
- Dynamic form generation
- Real-time total calculations
- Collapsible sections for better UX

### 4. Running Costs (Driftkostnad)
**Description**: Separate input for monthly running costs.

**Requirements**:
- Dedicated input field (default: 6,000 SEK/month)
- Include in total housing cost calculation
- Separate from other expense categories

### 5. Results Analysis
**Description**: Display calculation results in comprehensive table format.

**Requirements**:
- Show all loan scenarios (interest × amortization combinations)
- Display monthly housing cost
- Show total expenses range
- Calculate remaining savings range
- Color coding for positive/negative savings
- Sortable columns

**Technical Implementation**:
- Dynamic table generation
- Conditional formatting
- Responsive design for mobile
- Export functionality (future feature)

### 6. Data Visualization
**Description**: Visual representation of financial data.

**Requirements**:
- Pie chart for expense distribution
- Bar chart for loan scenarios comparison
- Interactive tooltips
- Responsive charts
- Legend with category names

**Technical Implementation**:
- Recharts library
- Dynamic data binding
- Mobile-friendly visualizations
- Color-coded categories

### 7. Localization
**Description**: Support for Swedish and English languages.

**Requirements**:
- Language toggle switch
- All UI text in both languages
- Swedish number formatting (space as thousand separator)
- Swedish currency formatting
- Proper decimal handling (comma vs period)
- Default language: Swedish

**Technical Implementation**:
- Context-based language management
- Translation files
- Internationalization utilities
- Persistent language preference

### 8. Data Persistence
**Description**: Save user inputs between sessions.

**Requirements**:
- Store form values in localStorage
- Restore values on page load
- Clear data option
- Privacy-conscious implementation

**Technical Implementation**:
- localStorage API
- JSON serialization
- Data validation on load
- Clear data functionality

## Advanced Features (Future Enhancements)

### 9. Scenario Comparison
**Description**: Compare multiple calculation scenarios side by side.

**Requirements**:
- Save named scenarios
- Compare up to 3 scenarios
- Visual comparison charts
- Export comparison results

### 10. PDF Export
**Description**: Generate PDF reports of calculations.

**Requirements**:
- Professional report layout
- Include all calculations
- Add charts and visualizations
- Customizable header/footer

### 11. Advanced Analytics
**Description**: Deeper financial insights and projections.

**Requirements**:
- Long-term cost projections
- Interest rate sensitivity analysis
- Break-even calculations
- Affordability scoring

### 12. User Accounts
**Description**: Save calculations to user accounts.

**Requirements**:
- User registration/login
- Cloud storage of scenarios
- Share scenarios
- Data privacy compliance

## Non-Functional Requirements

### Performance
- Page load time < 3 seconds
- Smooth UI interactions
- Efficient calculations
- Optimized bundle size

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode

### Security
- Input validation
- XSS prevention
- Secure data handling
- Privacy-first approach

### Browser Support
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers

### Responsive Design
- Mobile-first approach
- Tablet optimization
- Desktop layouts
- Print-friendly styles