import React, { useState } from "react"
import { View } from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

const CalendarPage = () => {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();
  const [selectedDate, setSelectedDate] = useState('');
  return (
    <View>
      <DateTimePicker
        mode="single"
        date={selected}
        onChange={({ date }) =>  setSelected(date)}
        styles={{
          ...defaultStyles,
          today: { borderColor: 'blue', borderWidth: 1 }, // Add a border to today's date
          selected: { backgroundColor: 'blue' }, // Highlight the selected day
          selected_label: { color: 'white' }, // Highlight the selected day label
        }}
      />

      <Calendar
        onDayPress={day => {
          setSelectedDate(day.dateString);
        }}
        markedDates={{
          [selectedDate]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}
        }}
      />
    </View>

  );
}

export default CalendarPage
