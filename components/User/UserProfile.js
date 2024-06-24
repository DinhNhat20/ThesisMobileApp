import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { MyDispatcherContext, MyUserContext } from '../../configs/Context'
import MyStyles from '../../styles/MyStyles';
import { Avatar, Button } from 'react-native-paper';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = () => {
    const user = useContext(MyUserContext);
    const dispatch = useContext(MyDispatcherContext);
    const [profileOfUser, setProFileOfUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const defaultAvatar = require('../../components/images/logo.jpg');

    const [userRole, setUserRole] = useState('');

    const navigation = useNavigation();

    useEffect(() => {
      if (user.role === 1) {
        setUserRole('students')
      }

      if (user.role === 2) {
        setUserRole('lecturers')
      }

      if (user.role === 3) {
        setUserRole('department_admins')
      }
    }, [user.role]);

    const loadProfileOfUser = async () => {
        setLoading(true)
        try {
          let token = await AsyncStorage.getItem("token");

          let url = `${endpoint[userRole]}?user=${user.id}`;

          let res = await authAPI(token).get(url);

          setProFileOfUser(res.data[0]);

          
        } catch (ex) {
            console.error(ex)
        } finally {
            setLoading(false)
        }
      } 

  // gọi hàm loadCates 1 lần khi nạp các component
  useEffect(() => {
    if (userRole) {
        loadProfileOfUser();
    }
  }, [userRole, user.id]);

  const handleChangePassword = () => {
    // Điều hướng đến màn hình ChangePassword khi nhấn vào nút Đổi mật khẩu
    navigation.navigate('ChangePassword');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  return (
    <ScrollView>
    <View style={[MyStyles.container, MyStyles.margin, styles.container]}>
      <View>
        <Avatar.Image 
          source={user.avatar ? { uri: user.avatar } : require('../../components/images/logo.jpg')} // Sử dụng đường dẫn hình ảnh từ thuộc tính avatar của đối tượng user
          size={120} 
        />
      </View>

      <Text style={[styles.text]}>THÔNG TIN CÁ NHÂN</Text>
      <Text style={MyStyles.text04}>Username: {user.username}</Text>
      <Text style={MyStyles.text04}>Họ và tên: {profileOfUser?.full_name}</Text>
      <Text style={MyStyles.text04}>Mã người dùng: {profileOfUser?.code}</Text>
      <Text style={MyStyles.text04}>Ngày sinh: {formatDate(profileOfUser?.birthday)}</Text>
      <Text style={MyStyles.text04}>Giới tính: {profileOfUser?.gender}</Text>
      <Text style={MyStyles.text04}>Số điện thoại: {profileOfUser?.phone}</Text>
      <Text style={MyStyles.text04}>Địa chỉ: {profileOfUser?.address}</Text>

      <View style={[MyStyles.container, styles.buttonStyle]}>
        <Button style={[MyStyles.margin]} mode="contained" loading={loading} onPress={handleChangePassword}>Đổi mật khẩu</Button>   
        <Button style={[MyStyles.margin]} mode="contained" loading={loading} onPress={() => dispatch({"type": "logout"})}>Đăng xuất</Button> 
      </View>
      
    </View>
    </ScrollView>
  )
}

export default UserProfile
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    }, 
    maginTop: {
      marginTop: 24,
      marginBottom: 24
    },
    text: {
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20,
      fontSize: 20,
      fontWeight: '600',
      color: '#1877F2',
  }, image: {
      width: 200,
      height: 200,
      marginBottom: 25, 
      marginLeft: 98
  }, buttonStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
  }
})