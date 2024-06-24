import { StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import ThesisItem from '../Common/ThesisItem';
import MyStyles from '../../styles/MyStyles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Danh sách các khóa luận thuộc 1 hội đồng khi ấn vào hội đồng đó ở component LecturerCouncils

const Thesis01 = ({navigation, route}) => {
    const [theses, setTheses] = useState(null)
    const CouncilId = route.params?.CouncilId;
    const CouncilDetailsId = route.params?.CouncilDetailsId;

    const loadTheses = async () => {
        try {
          console.info(CouncilId)
          let token = await AsyncStorage.getItem("token");
          let res = await authAPI(token).get(endpoint['theses_of_council'](CouncilId))
          setTheses(res.data)
        } catch (err) {
          console.error(err)
        }
    }

    useEffect(() => {
        loadTheses()
    }, [CouncilId])

  return (
    <ScrollView>
        <View style={[MyStyles.container, MyStyles.margin]}>
            {theses === null ? (
                <ActivityIndicator />
            ) : (
                <>
                    {theses.length === 0 ? (
                        <Text style={MyStyles.text}>Hiện tại hội đồng không có khóa luận.</Text>
                    ) : (
                        theses.map(l => (
                            <TouchableOpacity
                                key={l.id}
                                onPress={() => navigation.navigate('ThesisDetail', { 'thesisId': l.id, 'CouncilDetailsId': CouncilDetailsId })}
                            >
                                <ThesisItem instance={l} />
                            </TouchableOpacity>
                        ))
                    )}
                </>
            )}
        </View>
    </ScrollView>
  )
}

export default Thesis01

const styles = StyleSheet.create({})