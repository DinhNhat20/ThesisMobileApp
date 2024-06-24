import React, { useState } from 'react';
import { Text, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyStyles from '../../styles/MyStyles';

const DataItem = ({ value, onChange }) => {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false);
        onChange(selectedDate || value || new Date());
    };

    const showDatePicker = () => {
        setShowPicker(true);
    };

    return (
        <>
            <Pressable onPress={showDatePicker}>
                <Text style={MyStyles.text02}>{(value || new Date()).toLocaleDateString()}</Text>
            </Pressable>
            {showPicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    display="spinner"
                    value={value || new Date()}
                    mode="date"
                    is24Hour={true}
                    onChange={handleDateChange}
                />
            )}
        </>
    );
};

export default DataItem;
