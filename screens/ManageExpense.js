import { useContext, useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import ExpenseForm from '../components/ManageExpense/ExpenseForm';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import IconButton from '../components/UI/IconButton';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { GlobalStyles } from '../constants/styles';
import { ExpensesContext } from '../store/expenses-context';
// import { storeExpense, updateExpense, deleteExpense } from '../util/http';
// import { addExpense, deleteExpense, updateExpense } from '../util/fireBase';
// import { AuthContext } from '../store/auth-context';
import { v4 as uuidv4 } from 'uuid';

function ManageExpense({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState();

  const expensesCtx = useContext(ExpensesContext);

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  // const authCtx = useContext(AuthContext);
  // const userId = authCtx.userId;
  // const token = authCtx.token;
  // console.log(userId)
  // console.log(token)
  console.log(expensesCtx.expenses)

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Edit Expense' : 'Add Expense',
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      // await deleteExpense(userId, editedExpenseId);
      await expensesCtx.deleteExpense(editedExpenseId);
      navigation.goBack();
    } catch (error) {
      setError('Could not delete expense - please try again later!');
      setIsSubmitting(false);
    }
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {

      if (!expenseData || Object.values(expenseData).includes(undefined)) {
        throw new Error('Invalid expense data');
      }

      if (isEditing) {
        console.log(editedExpenseId)
        console.log(expenseData)
        const updatedexpenseData = {...expenseData, id: editedExpenseId}
        console.log(updatedexpenseData)
        // await updateExpense(userId, editedExpenseId, expenseData);
        await expensesCtx.updateExpense(editedExpenseId, updatedexpenseData);
      } else {
        const expenseId = uuidv4();
        expenseData = {...expenseData, id: expenseId}
        // const newExpense = await addExpense(userId, expenseData);
        // console.log(expenseData)
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