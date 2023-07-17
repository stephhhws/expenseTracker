import { FlatList } from 'react-native';

import ExpenseItem from './ExpenseItem';

// function to render an individual item in the list
// it turns ExpenseItem component and passes all the item's properties to the component 
function renderExpenseItem(itemData) {
  return <ExpenseItem {...itemData.item} />;
}

// the component take a list of expenses as a prop and render each item using a flatlist 
function ExpensesList({ expenses }) {
  return (
    <FlatList
    // pass in the expenses array as the data to be rendered
      data={expenses}
      // use the renderExpenseItem function to specify how each item in the data should be rendered 
      renderItem={renderExpenseItem}
      // We also specify a key extractor function, which tells FlatList how to uniquely identify each item in the list.
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;