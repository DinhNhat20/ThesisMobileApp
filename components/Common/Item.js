import { View, TouchableOpacity, Text } from 'react-native';
import MyStyles from '../../styles/MyStyles';
import React from 'react'


const Item = ({ item, setSelectedValue, setMajorsVisible }) => {
  return (
    <View style={[MyStyles.container]}>
      <TouchableOpacity
        style={[]}
        onPress={() => {
          setSelectedValue(item.name);
          setMajorsVisible(false);
        }}
      >
        <Text style={[MyStyles.selectedRoleText, MyStyles.textInput]}>{item.name}</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Item

const styles = StyleSheet.create({})