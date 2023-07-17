import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { GlobalStyles } from '../../constants/styles';
import ExpensesOutput from '../../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../../store/expenses-context';


const AllExpensesScreen = ({ route }) => {
    // destructure the expenses data from expensesContext
    const { expenses } = useContext(ExpensesContext);
    // initialize state variable for filtered expenses
    const [filteredExpenses, setFilteredExpenses] = useState([]);


    useEffect(() => {
        // create a new filtered array of expenses for the selected year and month
        const filtered = expenses.filter(expense => {
            const [year, month, day] = expense.date.split('-');
            const expenseDate = new Date(year, month - 1, day);
            return (
                expenseDate.getFullYear() === route.params.year &&
                (expenseDate.getMonth() + 1) === route.params.month // JavaScript month range is 0-11
            );
        });
        // Set the state of 'filteredExpenses' to the newly filtered array
        setFilteredExpenses(filtered);
    }, [route.params.year, route.params.month, expenses]);

    return (
        // render the expensesOutput component with the filtered expense
        <View style={styles.container}>
            <ExpensesOutput
                expenses={filteredExpenses}
                expensesPeriod="Total"
                fallbackText="No registered expenses found!"
            />
        </View>
    );


};


export default AllExpensesScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 20,
        paddingBottom: 0,
        backgroundColor: GlobalStyles.colors.primary700,
    },
    infoText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 32,
    },
});
