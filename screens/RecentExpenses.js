import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/fireBase';
import { AuthContext } from '../store/auth-context';


function RecentExpenses() {
  // define a state variable to track the fetching status 
  const [isFetching, setIsFetching] = useState(true);
  // deine a state variable error to track any errors
  const [error, setError] = useState(false);
  // access the authContext 
  const authCtx = useContext(AuthContext);
  // extract the userId from the AuthContext 
  const userId = authCtx.userId;
  // Access the expenseContext 
  const expensesCtx = useContext(ExpensesContext);

  // fetch the expenses when the userId changes 
  useEffect(() => {

    async function getExpenses() {
      // setIsFetching(true);
      try {
        // fetch expenses using the userId from fireBase
        const expenses = await fetchExpenses(userId);
        // update the expense in the ExpensesContext using the setExpenses function
        await expensesCtx.setExpenses(expenses);
        setError(null)
      } catch (error) {
        setError('Could not fetch expenses!');
      }
      setIsFetching(false);
    }

    if (userId) { // only call getExpenses if userId is not null
      getExpenses();
    }
  }, [userId]);

  if (isFetching) {
    return <LoadingOverlay />;
  }

  if (error) {
    return <ErrorOverlay message={error} />;
  }

  // filter the recent expense of 7 days 
  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    const expenseDate = expense.date;

    return (
      expenseDate >= date7DaysAgo.toISOString().slice(0, 10) &&
      expenseDate <= today.toISOString().slice(0, 10)
    );
  });

  // render the recent output using expensesOutput 
  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default RecentExpenses;