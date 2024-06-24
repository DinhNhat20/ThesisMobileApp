import React from "react";
import MyStyles from "../../styles/MyStyles";
import Style from "./Style";
import { View, Text, Image, StyleSheet } from "react-native";

const Home = () => {
    return (
      <View style={[MyStyles.container, MyStyles.itemCenter]}>
        <Text style={[styles.textHeading]}>QUẢN LÝ KHÓA LUẬN TỐT NGHIỆP</Text>
        <Image style={[MyStyles.logoHomeImage]} source={require('../../components/images/logo.jpg')}/>
      </View>
    );
  }

  export default Home

  const styles = StyleSheet.create({
    textHeading: {
      fontSize: 24,
      textAlign: 'center',
      marginTop: 24,
      color: '#124f9f',
      fontWeight: '800',
  },
  })