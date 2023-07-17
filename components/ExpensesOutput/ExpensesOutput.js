import { StyleSheet, Text, View } from 'react-native';

import { GlobalStyles } from '../../constants/styles';
import ExpensesList from './ExpensesList';
import ExpensesSummary from './ExpensesSummary';

// define the expensesOutput component 
function ExpensesOutput({ expenses, expensesPeriod, fallbackText }) {
  // initially set content to the text component with fallbackText 
  let content = <Text style={styles.infoText}>{fallbackText}</Text>;

  // if there are expenses to display, update the content to ExpensesList component 
  if (expenses.length > 0) {
    content = <ExpensesList expenses={expenses} />;
  }

  // return a view containing an ExpensesSummary component
  // and either a fallbackText or ExpenseList component based on whether theer are expenses 
  return (
    <View style={styles.container}>
      <ExpensesSummary expenses={expenses} periodName={expensesPeriod} />
      {content}
      {/* <Text>{expenses[0].amount}</Text> */}
    </View>
  );
}

export default ExpensesOutput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 0,
    backgroundColor: GlobalStyles.colors.primary700,
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 32,
  },
});