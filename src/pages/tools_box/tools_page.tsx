import React, { useState } from "react"
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';

const ToolsPage = () => {
  const defaultStyles = useDefaultStyles();
  const [selected, setSelected] = useState<DateType>();
  return (
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
  );
}

export default ToolsPage
