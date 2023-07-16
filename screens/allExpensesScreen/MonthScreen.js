import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlobalStyles } from '../../constants/styles';

// const months = Array.from({ length: 12 }, (_, i) => i + 1); // Creates an array [1, 2, 3, ..., 12]
const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", 
"AUG", "SEP", "OCT", "NOV", "DEC"];

const MonthScreen = ({ navigation, route }) => (
    <View style={styles.container}>
            {months.map((month, idx) => (
                <Pressable key={month} style={styles.monthWrapper} onPress={() => navigation.navigate('Expense', { year: route.params.year, month: idx + 1})}>
                    <View style={styles.monthItem}>
                        <Text style={styles.monthText}> {month} </Text>
                    </View>
                </Pressable>
            ))}
        </View>
);

export default MonthScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: GlobalStyles.colors.primary700,
        flexDirection: "row",
        flexWrap: "wrap"
    },
    monthWrapper: {
        width: '33.33%', // this will make 3 items fit in one row
    },
    monthItem: {
        padding: 12,
        marginVertical: 8,
        marginHorizontal: 10,
        backgroundColor: GlobalStyles.colors.primary500,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 6,
        elevation: 3,
        shadowColor: GlobalStyles.colors.gray500,
        shadowRadius: 4,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.4,
    },
    monthText: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 15
    }
});