import { doc, updateDoc, arrayUnion, arrayRemove, setDoc, getDoc } from "firebase/firestore"; 
import { FIRESTORE_DB } from "../firebaseconfig"; // Change the path as needed

// userId is used to identify the document in Firestore 

// This function creates a new document for a new user in Firestore with the user's Id as the document Id
export const createUserDoc = async (userId) => {
  try {
    // Get a reference to the user document using the user ID
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);

    // Create the user document, which is initialized with an empty expense array 
    await setDoc(userDocRef, {
      expenses: [],
    });

    console.log('New user document created in Firestore.');

  } catch (error) {
    console.error('Error creating user document:', error);
  }
};

// the function retrieves the expenses for a particular user
export const fetchExpenses = async (userId) => {
  // get the user document references
  const userDocRef = doc(FIRESTORE_DB, 'users', userId);

  // fetching the user document 
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

// Function to add the expense for a user 
export const addExpense = async (userId, expense) => {
  try {
    // get the user document reference 
    const userDocRef = doc(FIRESTORE_DB, 'users', userId);
    // update the user document with the new expense 
    await updateDoc(userDocRef, {
      expenses: arrayUnion(expense),
    });
    console.log('Expense added for user.');
  } catch (error) {
    console.error('Error adding expense for user:', error);
  }
};

// Function to update an expense for a user
// Assumes 'oldExpense' is the exact object you want to update and 'newExpense' is the updated expense
export const updateExpense = async (userId, expenseId, newExpense) => {
  // get the user document reference 
  const userDocRef = doc(FIRESTORE_DB, 'users', userId);

  // fetch the user document 
  const docSnap = await getDoc(userDocRef);

  // get the current expenses
  const expenses = docSnap.data().expenses;

  // find the index of the expense to be updated 
  const idx = expenses.findIndex(expense => expense.id === expenseId);
  
  // replaced the old expense with the new expense 
  expenses[idx] = newExpense

  try {
    // update the user document with the updated expenses array
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
  // get the user document reference
  const userDocRef = doc(FIRESTORE_DB, 'users', userId);

  // fetch the user document 
  const docSnap = await getDoc(userDocRef);

  // get the current expenses
  const expenses = docSnap.data().expenses;

  // filter out the expense to be deleted 
  const filteredExpenses = expenses.filter((expense) => expense.id !== expenseId);
  try {
    // update the user document with the filtered expenses array 
    await updateDoc(userDocRef, {
      expenses: filteredExpenses
    });
    console.log('Expense deleted for user.');
  } catch (error) {
    console.error('Error deleting expense for user:', error);
  }
};