import { Button, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import { ActivityIndicator, DataTable } from 'react-native-paper'
import APIS, { endpoint } from '../../configs/APIS';

// Sửa điểm khóa luận

const UpdateThesisScore = ({navigation, route}) => {
    const [scores, setScores] = useState({});
    const [scoreDetails, setScoreDetails] = useState(null);
    const thesisId = route.params?.thesisId
    const thesisScoreId = route.params?.thesisScoreId
    const CouncilDetailsId = route.params?.CouncilDetailsId
    const [loading, setLoading] = useState(false);
    

    const loadScoreDetails = async () => {
        try {
            const res = await APIS.get(endpoint['score_details_thesisScoreId'](thesisScoreId));
            setScoreDetails(res.data)
          } catch (err) {
            console.error(err);
          }
    };

    useEffect(() => {
        loadScoreDetails()
    }, [thesisScoreId])

    const handleScoreChange = (id, value) => {
        setScores(prevScores => ({
          ...prevScores,
          [id]: value
        }));
      };

      const handleSaveScores = async () => {
        setLoading(true);
        try {
            const payload = scoreDetails.map(detail => ({
                id: detail.id,
                active: true,
                score: parseFloat(scores[detail.id] || 0),
                thesis_score: thesisScoreId,
                score_column: detail.score_column
            }));
            await Promise.all(payload.map(scoreDetail => APIS.put(endpoint['score_detail'](scoreDetail.id), scoreDetail)));

            alert('Lưu điểm thành công');
            navigation.navigate('ThesisDetail', {'thesisId': thesisId, 'CouncilDetailsId': CouncilDetailsId})
        } catch (err) {
            console.error(err);
            alert('Lưu điểm thất bại');
        } finally {
            setLoading(false);
        }
    };
  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>SỬA ĐIỂM KHÓA LUẬN {thesisScoreId}</Text>
            </View>

            <View style={[MyStyles.container, MyStyles.margin]}>
                    {scoreDetails === null ? (
                        <ActivityIndicator />
                    ) : (
                        scoreDetails.map(l => (
                            <View key={l.id} style={styles.row}>
                                <View style={[styles.column]}>
                                    <Text style={styles.cell}>{l.score_component_name}</Text>
                                    <Text>{l.score}</Text>
                                </View>
                                
                                <TextInput 
                                    style={[MyStyles.input, MyStyles.text02, styles.textInputScore]} 
                                    placeholder='Sửa điểm...'
                                    keyboardType='numeric'
                                    onChangeText={value => handleScoreChange(l.id, value)}
                                />
                            </View>
                        ))
                    )}
            </View>

            <Pressable style={MyStyles.btn} onPress={handleSaveScores}>
                {loading ? (
                <ActivityIndicator color="#FFFFFF" />
                ) : (
                <Text style={MyStyles.textBtn} onPress={handleSaveScores}>LƯU THAY ĐỔI</Text>
                )}
            </Pressable>

        </ScrollView>
        </KeyboardAvoidingView>
    </View>
  )
}

export default UpdateThesisScore

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingVertical: 30,
        paddingHorizontal: 30,
    },
    headerTopBar: {
        marginTop: 30,
        marginBottom: 30,
    },
    headerTopBarText: {
        fontSize: 18,
        textAlign: 'center',
        color: '#1877F2',
        fontWeight: 'bold'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,

    },
    heading: {
        flex: 1,
        fontSize: 14,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 2,
        elevation: 1,
        borderRadius: 3,
        borderColor: '#FFF',
        padding: 10,
        backgroundColor: '#FFF',
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 10,
    },
    cell: {
        fontSize: 15,
        textAlign: 'left',
        flex: 1,
    },
    textInputScore: {
        height: 46,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        fontSize: 12,
        textAlign: 'center',   
    },
    btnSubmit: {
        backgroundColor: '#1877F2',
        color: 'white',
    }
})