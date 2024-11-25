import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ScheduleVisitScreen = ({ route, navigation }) => {
  const { request } = route.params; // Get the request passed from the previous screen
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [notes, setNotes] = useState('');

  const onChange = (event, selectedDate) => {
    if (event.type === 'dismissed') {
      setShow(false);
      return; // Exit if the picker was dismissed
    }

    const currentDate = selectedDate || date; // Ensure selectedDate is not undefined
    setShow(false);
    setDate(currentDate); // Update the state with the selected date
  };

  const scheduleVisit = async () => {
    try {
      const response = await fetch(`YOUR_API_URL/api/vet_requests/${request.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Include token if required
        },
        body: JSON.stringify({
          status: 'accepted', // Assuming you accept the request
          visit_date: date.toISOString(), // Send the visit date
          notes: notes, // Any additional notes
        }),
      });
      if (response.ok) {
        alert('Visit scheduled successfully!');
        navigation.goBack(); // Navigate back after scheduling
      } else {
        alert('Failed to schedule the visit. Please try again.');
      }
    } catch (error) {
      console.error('Error scheduling visit:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Schedule a Visit</Text>
      <Text>Select Date and Time:</Text>
      <Button title="Show Date/Time Picker" onPress={() => setShow(true)} />
      {show && (
        <DateTimePicker
          value={date}
          mode="datetime"
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
      <Text style={styles.label}>Notes (optional):</Text>
      <TextInput
        style={styles.input}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any notes here"
        multiline
      />
      <Button title="Schedule Visit" onPress={scheduleVisit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    marginTop: 20,
    fontSize: 16,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});

export default ScheduleVisitScreen;
