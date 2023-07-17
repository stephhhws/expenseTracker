import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Input from './Input';
import Button from '../UI/Button';
import { getFormattedDate } from '../../util/date';
import { GlobalStyles } from '../../constants/styles';

function ExpenseForm({ submitButtonLabel, onCancel, onSubmit, defaultValues }) {
  // initial values of the state for form fields 
  const [inputs, setInputs] = useState({
    // if null, set to empty string 
    amount: { 
      value: defaultValues ? defaultValues.amount.toString() : '',
      isValid: true,
    },
    date: {
      value: defaultValues ? defaultValues.date : '',
      isValid: true,
    },
    description: {
      value: defaultValues ? defaultValues.description : '',
      isValid: true,
  },
  });

  // handler for input field changes 
  function inputChangedHandler(inputIdentifier, enteredValue) {
    // update the state to the currentInput
    setInputs((curInputs) => {
      return {
        // spread operator to keep old state data 
        ...curInputs,
        // dynamically update the state of specified field based on the inputIdentifier (e.g., "amount", "date", "description")
        // and set its value to the entered value, and assuming the entered value is valid, set isValid to true
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  // handle the form submission
  function submitHandler() {
    // gathering form data from state and storing it in an object 
    const expenseData = {
      // convert the amount from string to number with the plus operator
      amount: +inputs.amount.value,
      // get the date value from state 
      date: inputs.date.value, 
      // get the descirption value from the state
      description: inputs.description.value,
    };


  // validate the input  fields
  // check the amount is a valid number and is more than 0 
  const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
  // validate the date format using regex to match the pattern "YYYY-MM-DD"
  const dateIsValid = /^\d{4}-\d{2}-\d{2}$/.test(expenseData.date);
  // check that the description is not empty or just whitespace
  const descriptionIsValid = expenseData.description.trim().length > 0;

  // if validation fails, update the state with the invalid field and return 
  // This will stop the function from executing further and the form won't be submitted

  if (!amountIsValid || !dateIsValid || !descriptionIsValid) {
    // Alert.alert('Invalid input', 'Please check your input values');
    setInputs((curInputs) => {
      return {
        // For each input field, set the value as before and set isValid to the result of the validation
        amount: { value: curInputs.amount.value, isValid: amountIsValid },
        date: { value: curInputs.date.value, isValid: dateIsValid },
        description: {
          value: curInputs.description.value,
          isValid: descriptionIsValid,
        },
      };
    });
    return;
  }
  // If all fields are valid, call the onSubmit prop function with the form data
  onSubmit(expenseData);
}

const formIsInvalid =
  !inputs.amount.isValid ||
  !inputs.date.isValid ||
  !inputs.description.isValid;

  // render each of the input fields
return (
  <View style={styles.form}>
    <Text style={styles.title}>Your Expense</Text>
    <View style={styles.inputsRow}>
      <Input
        style={styles.rowInput}
        label="Amount"
        invalid={!inputs.amount.isValid}
        textInputConfig={{
          keyboardType: 'decimal-pad',
          onChangeText: inputChangedHandler.bind(this, 'amount'),
          value: inputs.amount.value,
        }}
      />
      <Input
        style={styles.rowInput}
        label="Date"
        invalid={!inputs.date.isValid}
        textInputConfig={{
          placeholder: 'YYYY-MM-DD',
          maxLength: 10,
          onChangeText: inputChangedHandler.bind(this, 'date'),
          value: inputs.date.value,
        }}
      />
    </View>
    <Input
      label="Description"
      invalid={!inputs.description.isValid}
      textInputConfig={{
        multiline: true,
        // autoCapitalize: 'none'
        // autoCorrect: false // default is true
        onChangeText: inputChangedHandler.bind(this, 'description'),
        value: inputs.description.value,
      }}
    />
    {formIsInvalid && (
      <Text style={styles.errorText}>
        Invalid input values - please check your entered data!
      </Text>
    )}
    <View style={styles.buttons}>
      <Button style={styles.button} mode="flat" onPress={onCancel}>
        Cancel
      </Button>
      <Button style={styles.button} onPress={submitHandler}>
        {submitButtonLabel}
      </Button>
    </View>
  </View>
);
}

export default ExpenseForm;

const styles = StyleSheet.create({
  form: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 24,
    textAlign: 'center',
  },
  inputsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowInput: {
    flex: 1,
  },
  errorText: {
    textAlign: 'center',
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});