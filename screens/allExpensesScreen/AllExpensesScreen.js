import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { GlobalStyles } from '../../constants/styles';
import ExpensesOutput from '../../components/ExpensesOutput/ExpensesOutput';
import { ExpensesContext } from '../../store/expenses-context';

const AllExpensesScreen = ({ route }) => {
    const { expenses } = useContext(ExpensesContext);
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    // console.log(filteredExpenses)
    // console.log(route.params.year)
    // console.log(route.params.month)

    useEffect(() => {
        const filtered = expenses.filter(expense => {
            const [year, month, day] = expense.date.split('-');
            const expenseDate = new Date(year, month - 1, day);
            return (
                expenseDate.getFullYear() === route.params.year &&
                (expenseDate.getMonth() + 1) === route.params.month // JavaScript month range is 0-11
            );
        });
        setFilteredExpenses(filtered);
    }, [route.params.year, route.params.month, expenses]);

    return (
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
