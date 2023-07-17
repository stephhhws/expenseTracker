
import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { GlobalStyles } from '../../constants/styles';
import { ExpensesContext } from '../../store/expenses-context';



const YearScreen = ({ navigation }) => {
    // get the expenses data from expenseContext
    const { expenses } = useContext(ExpensesContext);

    // initialise the state for storing the range of years with expense data 
    const [years, setYears] = useState([]);

    useEffect(() => {
        // sort the expenses based on the date 
        if (expenses && expenses.length > 0) {
            expenses.sort((a, b) => new Date(a.date) - new Date(b.date));

            // extract the start year and the end year from our expenses
            const startYear = parseInt(expenses[0].date.slice(0, 4));
            const endYear = parseInt(expenses[expenses.length - 1].date.slice(0, 4));
            const years = [];

            // create an array of years from startYear to endYear
            for (let i = startYear; i <= endYear; i++) {
                years.unshift(i);
            }
            // update the year state 
            setYears(years);
        }
    }, [expenses]);
    


    return (
        // container view for the screen 
        <View style={styles.container}>
            {/* // if there are available year data, map each year to a pressable component  */}
            {years.length > 0 ? 
            years.map((year) => (
                <Pressable key={year} onPress={() => navigation.navigate('Month', { year })}>
                    <View style={styles.yearItem}>
                        <Text style={styles.yearText}> {year} </Text>
                    </View>
                </Pressable>
            ))
            :
            <Text style={styles.text}>No Data Found</Text>
        }
        </View >
    )
};

export default YearScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 0,
        backgroundColor: GlobalStyles.colors.primary700,
    },
    yearItem: {
        padding: 12,
        marginVertical: 8,
        backgroundColor: GlobalStyles.colors.primary500,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 6,
        elevation: 3,
        shadowColor: GlobalStyles.colors.gray500,
        shadowRadius: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
    },
    yearText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 15
    },
    text: {
        textAlign: 'center',
        padding: 10,
        color: '#5c3f2f',
        fontSize: 18,

    }
});