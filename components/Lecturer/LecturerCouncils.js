import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles';
import { authAPI } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import CouncilItem from '../Common/CouncilItem';

// Danh sách các hội đồng của user giảng viên đang đăng nhập

const LecturerCouncils = ({navigation}) => {

  const [councils, setCouncils] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCouncils = async () => {
      try {
        let token = await AsyncStorage.getItem("token");
        let response = await authAPI(token).get('/lecturer-councils/'); // Lấy danh sách các hội đồng mà giảng viên tham gia
        setCouncils(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCouncils();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Function kiểm tra hội đồng mở hay khóa
  const handleCouncilPress = (council) => {
    if (council.active) {
      goThesis(council.id, council.details[0].id);
    } else {
      Alert.alert('Thông báo', 'Hội đồng này đã bị khóa');
    }
  };

  const goThesis = (CouncilId, CouncilDetailsId) => {
    navigation.navigate('Thesis01', {'CouncilId': CouncilId, 'CouncilDetailsId': CouncilDetailsId})
  }

  return (
  <ScrollView>
    <View style={MyStyles.container}>
      {councils.map(c => <TouchableOpacity key={c.id} onPress={() => handleCouncilPress(c)}>
          <CouncilItem instance={c}/>
      </TouchableOpacity>)}
    </View>
  </ScrollView>
  );
}

export default LecturerCouncils

const styles = StyleSheet.create({})