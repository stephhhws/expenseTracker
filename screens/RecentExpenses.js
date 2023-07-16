import { useContext, useEffect, useState } from 'react';

import ExpensesOutput from '../components/ExpensesOutput/ExpensesOutput';
import ErrorOverlay from '../components/UI/ErrorOverlay';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import { ExpensesContext } from '../store/expenses-context';
import { getDateMinusDays } from '../util/date';
import { fetchExpenses } from '../util/fireBase';
import { AuthContext } from '../store/auth-context';

function RecentExpenses() {
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(false);
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId;
  const expensesCtx = useContext(ExpensesContext);

  useEffect(() => {
    async function getExpenses() {
      // setIsFetching(true);
      try {
        console.log("recentexpense", userId)
        const expenses = await fetchExpenses(userId);
        console.log(expenses)
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


  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    const expenseDate = expense.date;

    return (
      expenseDate >= date7DaysAgo.toISOString().slice(0, 10) &&
      expenseDate <= today.toISOString().slice(0, 10)
    );
  });

  // console.log("Recent expenses:", recentExpenses);
  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default RecentExpenses;