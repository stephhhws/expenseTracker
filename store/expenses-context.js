import { createContext, useReducer, useEffect, useContext } from 'react';
import { createUserDoc, addExpense, deleteExpense, updateExpense } from '../util/fireBase'; // Import your Firestore service functions
import { AuthContext } from '../store/auth-context';

export const ExpensesContext = createContext({
  expenses: [],
  addExpense: (expense) => { },
  deleteExpense: (expense) => { },
  updateExpense: (oldExpense, newExpense) => { },
  setExpenses: (expenses) => { },
});

function expensesReducer(state, action) {
  switch (action.type) {
    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;
    case 'ADD':
      // const newExpense = { ...action.payload, date: new Date(action.payload.date) };
      return [action.payload, ...state];
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload);
    case 'UPDATE':
      const updatableExpenseIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );
      // const updatableExpense = state[updatableExpenseIndex];
      const updatedItem = {...action.payload.newExpense };
      const updatedExpenses = [...state];
      updatedExpenses[updatableExpenseIndex] = updatedItem;
      return updatedExpenses;
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [expensesState, dispatch] = useReducer(expensesReducer, []);
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId; // Replace with the actual user ID



  function addExpenseData(expense) {
    addExpense(userId, expense).then(() => {
      dispatch({ type: 'ADD', payload: expense });
    });
  }

  function deleteExpenseData(expenseId) {
    deleteExpense(userId, expenseId).then(() => {
      dispatch({ type: 'DELETE', payload: expenseId });
    });
  }

  function updateExpenseData(editedExpenseId, expenseData) {
    updateExpense(userId, editedExpenseId, expenseData).then(() => {
      dispatch({ type: 'UPDATE', payload: { id: editedExpenseId, newExpense: expenseData } });
    });
  }

  async function setExpenses(expenses) {
    dispatch({ type: 'SET', payload: expenses });
  }

  const value = {
    expenses: expensesState,
    addExpense: addExpenseData,
    deleteExpense: deleteExpenseData,
    updateExpense: updateExpenseData,
    setExpenses: setExpenses,
  };

  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
