import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore"; 
import { FIRESTORE_DB } from "../firebaseconfig"; // Change the path as needed

export const createUserDoc = async (userId) => {
  try {
    // Get a reference to the user document using the user ID
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);

    // Create the user document
    await setDoc(userDocRef, {
      expenses: [],
    });

    console.log('New user document created in Firestore.');

  } catch (error) {
    console.error('Error creating user document:', error);
  }
};


export const fetchExpenses = async (userId) => {
  const userDocRef = doc(FIRESTORE_DB, 'users', userId);

  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    // console.log("Document data:", docSnap.data());
    return docSnap.data().expenses; // Returns the array of expenses
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return []; // Returns an empty array if no document found
  }
};

// Function to add an expense for a user
export const addExpense = async (userId, expense) => {
  try {
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    await updateDoc(userDocRef, {
      expenses: arrayUnion(expense),
    });
    console.log('Expense added for user.');
  } catch (error) {
    console.error('Error adding expense for user:', error);
  }
};


// export const addExpense = async (userId, expense) => {
//   // console.log('Adding expense:', expense);  // Keep this line for debugging
//   console.trace('Adding expense:', expense)
//   try {
//     const userDocRef = doc(FIRESTORE_DB, 'users', userId);
//     const debugExpense = { id: "test", description: "test"};  // Simple object with static data

//     await updateDoc(userDocRef, {
//       expenses: arrayUnion(debugExpense),  // Use debugExpense instead of expense
//     });

//     console.log('Expense added for user.');
//   } catch (error) {
//     console.error('Error adding expense for user:', error);
//   }
// };

// Function to update an expense for a user
// Assumes 'oldExpense' is the exact object you want to update and 'newExpense' is the updated expense
export const updateExpense = async (userId, expenseId, newExpense) => {

  const userDocRef = doc(FIRESTORE_DB, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  const expenses = docSnap.data().expenses;
  const idx = expenses.findIndex(expense => expense.id === expenseId);
  expenses[idx] = newExpense

  try {
    // const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    await updateDoc(userDocRef, {
      expenses: expenses
    });

    console.log('Expense updated for user.');
  } catch (error) {
    console.error('Error updating expense for user:', error);
  }
};


// Function to delete an expense for a user
// Assumes 'expense' is the exact object you want to remove
export const deleteExpense = async (userId, expenseId) => {
  // console.log(expenseId)
  const userDocRef = doc(FIRESTORE_DB, 'users', userId);
  const docSnap = await getDoc(userDocRef);
  const expenses = docSnap.data().expenses;
  const filteredExpenses = expenses.filter((expense) => expense.id !== expenseId);
  try {
    // const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    await updateDoc(userDocRef, {
      expenses: filteredExpenses
    });
    console.log('Expense deleted for user.');
  } catch (error) {
    console.error('Error deleting expense for user:', error);
  }
};