import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';

const MilkRecordsScreen = () => {
  const navigation = useNavigation();

  // Sample data for production details (per cow and per milking time)
  const milkRecords = {
    '2024-10-01': [
      { cowId: 'Cow1', morning: 5, evening: 6 },
      { cowId: 'Cow2', morning: 4, evening: 5 },
    ],
    '2024-10-02': [
      { cowId: 'Cow1', morning: 6, evening: 7 },
      { cowId: 'Cow2', morning: 5, evening: 6 },
    ],
    '2024-10-03': [
      { cowId: 'Cow1', morning: 7, evening: 8 },
      { cowId: 'Cow2', morning: 6, evening: 5 },
    ],
  };

  // Highlight available dates on the calendar
  const markedDates = Object.keys(milkRecords).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#50C878', activeOpacity: 0.5 };
    return acc;
  }, {});

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    if (milkRecords[selectedDate]) {
      navigation.navigate('MilkDetail', { date: selectedDate, productionDetails: milkRecords[selectedDate] });
    } else {
      Alert.alert('No records', `No milk production records found for ${selectedDate}`);
    }
  };

  return (
    <View style={styles.container1}>
      <Text style={styles.title}>Milk Records</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#f0f0f5',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#50C878',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FF6347',
            dayTextColor: '#2d4150',
            arrowColor: '#FF6347',
            monthTextColor: '#FF6347',
            textDayFontFamily: 'Arial',
            textMonthFontFamily: 'Arial',
            textDayHeaderFontFamily: 'Arial',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue background to create a soft look
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
});

export default MilkRecordsScreen;
