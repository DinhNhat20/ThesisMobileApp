import { View, Text, Alert, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, Pressable, TextInput } from "react-native";
import React, { useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import { ActivityIndicator, HelperText, TouchableRipple } from "react-native-paper";
import * as ImagePicker from 'expo-image-picker';
import APIS, { endpoint } from '../../configs/APIS';

const Register = ({navigation}) => {
  const [user, setUser] = useState({});
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateState = (field, value) => {
    setUser(current => {
      return {...current, [field]: value}
    })
  }


  const picker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status != 'granted')
      Alert.alert("iThesisApp", "Permissions Denied!")
    else {
      let res = await ImagePicker.launchImageLibraryAsync();
      if(!res.canceled) {
        updateState("avatar", res.assets[0]);
      }
    }
  }


  const register = async () => {
    if (user.password !== user.confirm)
        setErr(true);
    else {
        setErr(false);
        setLoading(true);
        try {
            let form = new FormData();

            for (let f in user)
                if (f !== 'confirm')
                    if (f === 'avatar')
                        form.append(f, {
                            uri: user.avatar.uri,
                            name: user.avatar.fileName,
                            type: user.avatar.type
                        });
                    else
                        form.append(f, user[f]);

            let res = await APIS.post(endpoint['register'], form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            if (res.status === 201)
                navigation.navigate('Login');
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    }
}


  return (
    <View style={[MyStyles.container, MyStyles.padding, {marginTop: 20}]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <Text style={[styles.text, {color: '#1877F2'}]}>ĐĂNG KÝ TÀI KHOẢN</Text>

                <Text style={[{color: '#4E4B66'}]}>Tên</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập tên...'
                    value={user.first_name}
                    onChangeText={t => updateState('first_name', t)}
                />

                <Text style={[{color: '#4E4B66'}]}>Họ và tên đệm</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập họ và tên đệm...'
                    value={user.last_name}
                    onChangeText={t => updateState('last_name', t)}
                />

                <Text style={[{color: '#4E4B66'}]}>Tên đăng nhập</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập tên đăng nhập...'
                    value={user.username}
                    onChangeText={t => updateState('username', t)}
                />

                <Text style={[{color: '#4E4B66'}]}>Mật khẩu</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập mật khẩu...'
                    value={user.password}
                    onChangeText={t => updateState('password', t)}
                    secureTextEntry
                />

                <Text style={[{color: '#4E4B66'}]}>Xác nhận mật khẩu</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Xác nhận mật khẩu...'
                    value={user.confirm}
                    onChangeText={t => updateState('confirm', t)}
                    secureTextEntry
                />
                
                <HelperText type="error" visible={err}>
                    Mật khẩu không khớp!
                </HelperText>

                <TouchableRipple onPress={picker}>
                    <Text>Chọn ảnh đại diện...</Text>
                </TouchableRipple>

                {user.avatar && <Image source={{uri: user.avatar.uri}} style={MyStyles.avatar} />}

                <Pressable style={styles.btnLogin} onPress={register}>
                    {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                    ) : (
                    <Text style={styles.textLogin}>Đăng ký</Text>
                    )}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
  )
}

export default Register

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
      marginBottom: 24,
      fontSize: 20,
      fontWeight: 'bold',
      color: '#050505',
  },
  text02: {
      textAlign: 'center',
      fontSize: 16,
      marginTop: 20, 
      color: '#4E4B66',
      marginBottom: 40,
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
})