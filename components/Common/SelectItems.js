import { StyleSheet, Text, TouchableOpacity, View, Modal, FlatList } from 'react-native'
import React, { useState } from 'react'
import MyStyles from '../../styles/MyStyles';

const SelectItems = ({ title, items, itemsVisible, setItemsVisible, selectedItems, renderItems }) => {
// Hàm xử lý khi người dùng chọn một item
//   const handleItemPress1 = (item) => {
//     if (selectedLecturers.includes(item)) {
//         setSelectedLecturers(selectedLecturers.filter(selectedLecturer => selectedLecturer !== item));
//     } else {
//       setSelectedLecturers([...selectedLecturers, item]);
//     }
// };

// // Hàm hiển thị mỗi item trong danh sách
// const renderItems1 = ({ item }) => (
//     <TouchableOpacity
//         style={[MyStyles.roleItem, selectedLecturers.includes(item) && MyStyles.selectedRoleItem]}
//         onPress={() => handleItemPress1(item)}
//     >
//         <Text style={[MyStyles.margin, MyStyles.text]}>{item.full_name}</Text>
//     </TouchableOpacity>
// );

// // Hàm hiển thị các item đã chọn
// const renderSelectedItems1 = () => {
//     if (selectedLecturers.Length === 0) {
//         return <Text style={[MyStyles.input, MyStyles.text02]}>Giảng viên thực hiện</Text>
//     }
//     return selectedLecturers.map((lecturer) => (
//         <View key={lecturer.user} style={[MyStyles.input, MyStyles.text02]}>
//             <Text style={[MyStyles.text02, MyStyles.textInput]}>{lecturer.full_name}</Text>
//         </View>  
//     ));
// };

const renderSelectedItems = () => {
    if (!selectedItems || selectedItems.length === 0) {
        return <Text style={[MyStyles.input, MyStyles.text02]}>{title}</Text>
    }
    return selectedItems.map((item) => (
        <View key={item.user} style={[MyStyles.input, MyStyles.text02]}>
            <Text style={[MyStyles.text02, MyStyles.textInput]}>{item.full_name}</Text>
        </View>  
    ));
};

    return (
        <View>
            <Text style={[MyStyles.text02]}>{title}</Text>
            {/* TouchableOpacity để hiển thị và mở modal */}
            <TouchableOpacity onPress={() => setItemsVisible(true)}>
                <View>
                    {renderSelectedItems()}
                </View>
            </TouchableOpacity>

            {/* Modal hiển thị danh sách giảng viên */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={itemsVisible}
                onRequestClose={() => setItemsVisible(false)}
            >
                <View style={[{flex:1}, {justifyContent: "center"}, {alignItems: "center"}, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}, {paddingTop: 180}, {paddingBottom: 180}, {paddingRight: 80}, {paddingLeft: 80}]}>
                    <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                        {/* FlatList hiển thị danh sách giảng viên */}
                        <FlatList
                            data={items}
                            renderItem={renderItems}
                            keyExtractor={(item) => item.user.toString()}
                        />
                        {/* Button để đóng modal */}
                        <TouchableOpacity onPress={() => setItemsVisible(false)}>
                            <Text style={[MyStyles.closeButton, MyStyles.text02]}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};



export default SelectItems

const styles = StyleSheet.create({})