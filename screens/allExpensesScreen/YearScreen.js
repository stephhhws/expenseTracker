
import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { GlobalStyles } from '../../constants/styles';
import { ExpensesContext } from '../../store/expenses-context';


// const years = [2023]; // Update this based on your requirement

const YearScreen = ({ navigation }) => {
    const { expenses } = useContext(ExpensesContext);
    const [years, setYears] = useState([]);

    useEffect(() => {
        expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
        const startYear = parseInt(expenses[0].date.slice(0, 4))
        const endYear = parseInt(expenses[expenses.length - 1].date.slice(0, 4))
        const years = [];
        for (let i = startYear; i <= endYear; i++) {
            years.unshift(i);
        }
        setYears(years);
    }, [expenses])


    return (
        <View style={styles.container}>
            {years.map((year) => (
                <Pressable key={year} onPress={() => navigation.navigate('Month', { year })}>
                    <View style={styles.yearItem}>
                        <Text style={styles.yearText}> {year} </Text>
                    </View>
                </Pressable>
            ))}
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
    }
});