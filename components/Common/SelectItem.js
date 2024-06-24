import React from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import MyStyles from '../../styles/MyStyles';

const SelectItem  = ({ title, selectedItemValue, setSelectedItemValue, Items, keyName, setItemsVisible, itemsVisible }) => {
  if (!Items || Items.length === 0) {
    return null;
  }
  const renderItem = ({ item }) => (
    <View style={[MyStyles.container]}>
        <TouchableOpacity
        style={[]}
        onPress={() => {
          setSelectedItemValue(item.id); // lưu id của đối tượng
          setItemsVisible(false);
      }}
    >
      <Text style={[MyStyles.text05, MyStyles.textInput01]}>{item[keyName]}</Text>
    </TouchableOpacity>
    </View>
  );

  const selectedItem = Items.find(item => item.id === selectedItemValue);

  return (
    <View>
      <Text style={MyStyles.text02}>{title}</Text>
      <TouchableOpacity onPress={() => setItemsVisible(true)}>
        <View style={[MyStyles.input]}>
          <Text style={MyStyles.text02}>{selectedItem ? selectedItem[keyName] : `Chọn ${title.toLowerCase()}`}</Text>
        </View>
      </TouchableOpacity>
      <Modal // Hiển thị danh sách các item để chọn
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
              keyExtractor={item => item.id.toString()}
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

export default SelectItem ;
