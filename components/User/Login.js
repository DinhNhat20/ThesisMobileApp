import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useContext, useState } from 'react';
import MyStyles from '../../styles/MyStyles';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useNavigation } from "@react-navigation/native";
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatcherContext } from '../../configs/Context';
import { ActivityIndicator } from 'react-native-paper';


const Login = () => {
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(false);
    const nav = useNavigation();
    const dispatch = useContext(MyDispatcherContext);
  
    const updateState = (field, value) => {
      setUser(current => {
        return {...current, [field]: value}
      })
    }

    const login = async () => {
        setLoading(true)
        try {
            let res = await APIS.post(endpoint['login'], {
                ...user,
                'client_id': 'SvkLUliPsUwRLEhh6Nz80dvajQC8BOvD9Qeontuc',
                'client_secret': 'AiS3TLncOMr3bQkTiReStrQZB8as5uGWS1NrOWstVL531Wzo868eCAksZS9FYlsOwBaq8Sq6pagaKXEMIyDzUl1MJWTx5i0AmR8xXqOR5gPvmzlIvfQzgl906WOXF6r1',
                'grant_type': 'password'
            });
    
            await AsyncStorage.setItem("token", res.data.access_token);
    
            setTimeout(async () => {
              let token = await AsyncStorage.getItem("token");
              let user = await authAPI(token).get(endpoint['current-user']);
              AsyncStorage.setItem('user', JSON.stringify(user.data));
              console.info(user.data);
    
              dispatch({
                'type': 'login',
                'payload': user.data
              })
    
              nav.navigate('Home');
            }, 100)
        } catch (ex) {
            console.error(ex)
        } finally {
            setLoading(false)
        }
      }

  return (
    <View style={[MyStyles.container, MyStyles.padding, {marginTop: 20}]}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView>
                <Text style={styles.text}>WELCOME TO APP</Text>
                <Text style={[styles.text, {color: '#1877F2'}]}>ĐỒ ÁN TỐT NGHIỆP OU</Text>
                <Text style={styles.text02}>Tri thức là sức mạnh</Text>

                <Text style={[{color: '#4E4B66'}]}>Username</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập username...'
                    value={user.username}
                    onChangeText={t => updateState('username', t)}
                />

                <Text style={[{color: '#4E4B66'}]}>Password</Text>
                <TextInput
                    style={styles.textInput}
                    placeholder='Nhập password...'
                    value={user.password}
                    onChangeText={t => updateState('password', t)}
                    secureTextEntry
                />
                
                <View style={styles.viewJustify}>
                    <View style={styles.viewRemember}>
                        <BouncyCheckbox fillColor="#1877F2"
                            unFillColor="#FFFFFF"/>
                        <Text style={styles.text03}>Remember me</Text>
                        </View>
                        <View>
                            <Text style={styles.text03}>Forgot the password?</Text>
                        </View>
                </View>
                <Pressable style={styles.btnLogin} onPress={login}>
                    {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                    ) : (
                    <Text style={styles.textLogin}>Login</Text>
                    )}
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    </View>
  )
}

export default Login

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
})