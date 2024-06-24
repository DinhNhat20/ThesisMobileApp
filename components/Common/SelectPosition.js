import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import MyStyles from '../../styles/MyStyles';

const SelectPosition  = ({ title, selectedItemValue, setSelectedItemValue, Items, setItemsVisible, itemsVisible }) => {
  const [selectedValueShow, setSelectedValueShow] = useState(null)
  const renderItem = ({ item }) => (
    <View style={[MyStyles.container]}>
        <TouchableOpacity
        style={[]}
        onPress={() => {
            setSelectedValueShow(item.full_name);
            setSelectedItemValue(item.user);
            setItemsVisible(false);
      }}
    >
      <Text style={[MyStyles.text05, MyStyles.textInput01]}>{item.full_name}</Text>
    </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <Text style={MyStyles.text02}>{title}</Text>
      <TouchableOpacity onPress={() => setItemsVisible(true)}>
        <View style={[MyStyles.input]}>
          <Text style={MyStyles.text02}>{selectedValueShow || 'Chọn giảng viên'}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={itemsVisible}
        onRequestClose={() => {
            setItemsVisible(false);
        }}
      >
        <View style={[{flex:1}, {justifyContent: "center"}, {alignItems: "center"}, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}, {paddingTop: 180}, {paddingBottom: 180}, {paddingRight: 80}, {paddingLeft: 80}]}>
          <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
            <FlatList
              data={Items}
              renderItem={renderItem}
              keyExtractor={(item) => item.user.toString()}
            />
            <TouchableOpacity onPress={() => setItemsVisible(false)}>
              <Text style={[MyStyles.closeButton, MyStyles.text02]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SelectPosition;
