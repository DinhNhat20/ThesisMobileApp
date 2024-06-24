import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useState } from 'react';
import MyStyles from '../../styles/MyStyles';
import { useNavigation } from "@react-navigation/native";
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { Alert } from 'react-native';

const ChangePassword = ({navigation}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      Alert.alert('Thông báo', 'Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    const formData = new FormData();
    formData.append('password', newPassword);
  
    try {
      setLoading(true);
      let token = await AsyncStorage.getItem("token");
      let response = await authAPI(token).patch(endpoint['current-user'], formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        Alert.alert('Thông báo', 'Đã thay đổi mật khẩu thành công.');
        navigation.navigate('UserProfile')
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        Alert.alert('Thông báo', 'Đã xảy ra lỗi');
      }
    } catch (error) {
      console.error('Lỗi khi thay đổi mật khẩu:', error);
      Alert.alert('Thông báo', 'Đã xảy ra lỗi khi thay đổi mật khẩu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[MyStyles.container, MyStyles.padding, {marginTop: 20}]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <ScrollView>
                <Text style={styles.text}>THAY ĐỔI MẬT KHẨU</Text>
                <Text style={[styles.text, {color: '#1877F2'}]}>ĐỒ ÁN TỐT NGHIỆP OU</Text>
                <Text style={styles.text02}>Tri thức là sức mạnh</Text>

                <Text style={[{color: '#4E4B66'}]}>Mật khẩu cũ</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập mật khẩu cũ...'
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    secureTextEntry
                />

                <Text style={[{color: '#4E4B66'}]}>Mật khẩu mới</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập mật khẩu mới...'
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />

                <Text style={[{color: '#4E4B66'}]}>Xác nhận mật khẩu mới</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Xác nhận mật khẩu mới...'
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
                
                <Pressable style={styles.btnLogin} onPress={handleChangePassword}>
                    {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                    ) : (
                    <Text style={styles.textLogin}>Xác nhận</Text>
                    )}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({   
  container: {
    flex: 1,
    backgroundColor: 'white',
    marginTop: 80,
    marginStart: 24,
    marginEnd: 24,
    flexDirection: 'column',
},
text: {
    textAlign: 'center',
    marginTop: 20,
    // fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#050505',
},
text02: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20, 
    color: '#4E4B66',
    marginBottom: 48,
},
text03: {
    fontSize: 10,
},
textInput: {
    height: 54,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 6,
    marginBottom: 12,
    color: '#4E4B66',
},
viewRemember: {
    flexDirection: 'row',
    alignItems: 'center',
},
viewJustify: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
},
btnLogin: {
    height: 48,
    backgroundColor: '#1877F2',
    borderRadius: 10,
    marginTop: 18,
    justifyContent: 'center',
    alignItems: 'center',
},
textLogin: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
}
});
