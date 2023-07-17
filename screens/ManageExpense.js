import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
import { v4 as uuidv4 } from 'uuid';


function ManageExpense({ route, navigation }) {
  // state variable to manage submission status and error status 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  // Access the expenses context 
  const expensesCtx = useContext(ExpensesContext);

  // get the expense ID from the navigation parameters, and check if we are editing an exisiting expense 
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  console.log(expensesCtx.expenses)

  // find the selected expense in the context based on the Id
  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  // set the navigation title based on whether we are editing or adding a new expense
  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  // Handler for deleting an expense 
  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      // use the deleteExpense function in expenseContext with the editedExpenseId
      await expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError('Could not delete expense - please try again later!');
      setIsSubmitting(false);
    }
  }

  // if the user press cancel, go back to the last page 
  function cancelHandler() {
    navigation.goBack();
  }

  // handler for confirming the action (either updating an exisiting expense or adding expense)
  // expenseData comes from expense form component, the form data is passed as an argument to the confirmHandler function
  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {
      // check if expenseData is undefined, null or contain any undefined value 
      if (!expenseData || Object.values(expenseData).includes(undefined)) {
        throw new Error('Invalid expense data');
      }

      // if the component is in edit mode
      if (isEditing) {
        // create a new object that merge the updated expense data and the ID of the expense being edited  
        // which combines all properties from the expenseData object and adds a new property id with the value of editedExpenseId
        const updatedexpenseData = {...expenseData, id: editedExpenseId}

        // call the updateExpense method from expenses context
        await expensesCtx.updateExpense(editedExpenseId, updatedexpenseData);
      } 
      // if the component is in add mode 
      else {
        // generate a new unique ID for the expense 
        const expenseId = uuidv4();

        // create a new object that merges the provided expense data and the newly generated ID
        expenseData = {...expenseData, id: expenseId}
        // call the addExpense method from the expenses context 
        await expensesCtx.addExpense(expenseData);
      }
      navigation.goBack();
    } catch (error) {
      setError('Could not save data - please try again later!');
      console.error('Error adding/updating expense:', error);
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) {
    return <ErrorOverlay message={error} />;
  }

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  // render the expenseform component, passing the necessary props
  // if we are editing an exisiting expense, also render a delete button 
  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? 'Update' : 'Add'}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: 'center',
  },
});