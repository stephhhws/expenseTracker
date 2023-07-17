import { createContext, useReducer, useEffect, useContext } from 'react';
import { createUserDoc, addExpense, deleteExpense, updateExpense } from '../util/fireBase'; // Import your Firestore service functions
import { AuthContext } from '../store/auth-context';

// create a new context for expenses with an initial value
export const ExpensesContext = createContext({
  expenses: [],
  addExpense: (expense) => { },
  deleteExpense: (expense) => { },
  updateExpense: (oldExpense, newExpense) => { },
  setExpenses: (expenses) => { },
});

// define the reducer function for managing state 
function expensesReducer(state, action) {
  switch (action.type) {
    // if the action is set, replace the entire state with the new payload (reversed)
    case 'SET':
      const inverted = action.payload.reverse();
      return inverted;

    // If the action is 'ADD', add the new expense to the start of the state array
    case 'ADD':
      // payload is the item we want to add
      return [action.payload, ...state];
    
    // If the action is 'DELETE', remove the expense with the specified ID from the state array
    case 'DELETE':
      return state.filter((expense) => expense.id !== action.payload);
    
    // If the action is 'UPDATE', replace the expense with the specified ID in the state array
    case 'UPDATE':
      // find the index of the expense to be updated in the current stae array
      const updatableExpenseIndex = state.findIndex(
        // check if the id of the expense matches the id provided in the payload 
        (expense) => expense.id === action.payload.id
      );

      // it creates a copy of the newExpense object from the payload 
      const updatedItem = {...action.payload.newExpense };

      // a copy of the current state is created 
      //<- this is done beacuase we should never mutate the state directly in react 
      const updatedExpenses = [...state];

      // the expense at the found index in the copied state is replaced with the copoed new expense 
      updatedExpenses[updatableExpenseIndex] = updatedItem;

      // return the updated copy of state 
      return updatedExpenses;
    
      // If the action type is not recognise -> return the current state unchange 
    default:
      return state;
  }
}

// Define the context provider component 
function ExpensesContextProvider({ children }) {
  // create the expense state with the useReducer hook
  const [expensesState, dispatch] = useReducer(expensesReducer, []);

  // get the userId from the auth context 
  const authCtx = useContext(AuthContext);
  const userId = authCtx.userId; // Replace with the actual user ID

  // define the function for addening expense 
  function addExpenseData(expense) {
    // add the expense in firestore and then in state 
    addExpense(userId, expense).then(() => {
      // dispatch function is used to send action to the reducer function 
      dispatch({ type: 'ADD', payload: expense });
    });
  }

  // define the function for deleting an expense 
  function deleteExpenseData(expenseId) {
    // delete the expense in firestore and then in state
    deleteExpense(userId, expenseId).then(() => {
      dispatch({ type: 'DELETE', payload: expenseId });
    });
  }

  // define the function for updating an expense 
  function updateExpenseData(editedExpenseId, expenseData) {
    // update the expense in firestore and then in state 
    updateExpense(userId, editedExpenseId, expenseData).then(() => {
      dispatch({ type: 'UPDATE', payload: { id: editedExpenseId, newExpense: expenseData } });
    });
  }

  // define the function for setting the entire expenses state 
  async function setExpenses(expenses) {
    dispatch({ type: 'SET', payload: expenses });
  }

  // define the value to be provided to children component 
  const value = {
    expenses: expensesState,
    addExpense: addExpenseData,
    deleteExpense: deleteExpenseData,
    updateExpense: updateExpenseData,
    setExpenses: setExpenses,
  };

  // provide the expenses context to children component
  return (
    <ExpensesContext.Provider value={value}>
      {children}
    </ExpensesContext.Provider>
  );
}

export default ExpensesContextProvider;
