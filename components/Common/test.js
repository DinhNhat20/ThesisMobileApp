import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import APIS, { endpoint } from '../../configs/APIS';
import MyStyles from '../../styles/MyStyles';



const test = () => {
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    // Hàm fetch danh sách items từ API
    const loadItems = async () => {
        try {
            const response = await APIS.get(endpoint['students']);
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    // Hàm xử lý khi người dùng chọn một item
    const handleItemPress = (item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            setSelectedItems([...selectedItems, item]);
        }
    };

    // Hàm hiển thị mỗi item trong danh sách
    const renderItems = ({ item }) => (
        <TouchableOpacity
            style={[MyStyles.roleItem, selectedItems.includes(item) && MyStyles.selectedRoleItem]}
            onPress={() => handleItemPress(item)}
        >
            <Text style={[MyStyles.roleItemText, MyStyles.margin, MyStyles.text]}>{item.full_name}</Text>
        </TouchableOpacity>
    );

    // Hàm hiển thị các vai trò đã chọn
    const renderSelectedRoles = () => {
        if (selectedItems.length === 0) {
            return <Text style={MyStyles.input}>No roles selected</Text>
        }
        return selectedItems.map((item) => (
            <View key={item.user} style={[MyStyles.input]}>
                <Text style={[MyStyles.selectedRoleText, MyStyles.textInput]}>{item.full_name}</Text>
            </View>  
        ));
    };

  return (
    <View style={MyStyles.container}>
    {/* TouchableOpacity để hiển thị và mở modal */}
    <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View>
            {renderSelectedRoles()}
        </View>
    </TouchableOpacity>

    {/* Modal hiển thị danh sách vai trò */}
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={[{flex:1}, MyStyles.Text, {justifyContent: "center"}, {alignItems: "center"}, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}, {paddingTop: 200}, {paddingBottom: 200}, {paddingRight: 100}, {paddingLeft: 100}]}>
            <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                {/* FlatList hiển thị danh sách vai trò */}
                <FlatList
                    data={items}
                    renderItem={renderItems}
                    keyExtractor={(item) => item.user.toString()}
                />
                {/* Button để đóng modal */}
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={MyStyles.closeButton}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
</View>
  )
}

export default test

const styles = StyleSheet.create({})