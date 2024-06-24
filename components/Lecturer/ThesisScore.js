import { Alert, Button, FlatList, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import { ActivityIndicator, DataTable } from 'react-native-paper'
import APIS, { endpoint } from '../../configs/APIS';

// Chấm điểm khóa luận

const ThesisScore = ({navigation, route}) => {
    const [scores, setScores] = useState({});
    const [scoreColumns, setScoreColumns] = useState(null);
    const thesisId = route.params?.thesisId
    const thesisScoreId = route.params?.thesisScoreId
    const [loading, setLoading] = useState(false);

    const loadScoreColumns = async () => {
        try {
            let res = await APIS.get(endpoint['score_columns'])
            setScoreColumns(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        loadScoreColumns()
    }, [])

    const handleScoreChange = (id, value) => {
        setScores(prevScores => ({
            ...prevScores,
            [id]: value
        }));
    };

    const handleSaveScores = async () => {
        setLoading(true);
        const missingScores = scoreColumns.some(col => !scores[col.id]);

        if (missingScores) {
            Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ các điểm');
            return;
        }

        try {
            // Bước 1: Lưu các điểm
            const payload = Object.keys(scores).map(scoreColumnId => ({
                score: parseFloat(scores[scoreColumnId]),
                thesis_score: thesisScoreId,
                score_column: scoreColumnId
            }));
            await Promise.all(payload.map(scoreDetail => APIS.post(endpoint['score_details'], scoreDetail)));

             // Bước 2: Cập nhật điểm trạng thái thesisScore để xác định giảng viên đang login đã chấm điểm cho khóa luận này hay chưa
             const thesisScoreUpdateUrl = `${endpoint['thesis_scores']}${thesisScoreId}/`;
             await APIS.patch(thesisScoreUpdateUrl, { active: false });

             Alert.alert(
                'Thông báo',
                'Lưu điểm thành công',
                [
                    { text: 'OK', onPress: () => navigation.navigate('ThesisDetail', { thesisId }) }
                ]
            );
        } catch (err) {
            console.error(err);
            alert('Lưu điểm thất bại');
        } finally {
            setLoading(false)
        }
    };

  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>
            <View style={styles.headerTopBar}>
                <Text style={styles.headerTopBarText}>CHẤM ĐIỂM KHÓA LUẬN</Text>
            </View>

            <View style={[MyStyles.container, MyStyles.margin]}>
                    {scoreColumns === null ? (
                        <ActivityIndicator />
                    ) : (
                        scoreColumns.map(l => (
                            <View key={l.id} style={styles.row}>
                                <Text style={styles.cell}>{l.score_component} {l.weight * 100}%</Text>
                                <TextInput 
                                    style={[MyStyles.input, MyStyles.text02, styles.textInputScore]} 
                                    placeholder='Nhập điểm...'
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
                <Text style={MyStyles.textBtn}>LƯU ĐIỂM</Text>
                )}
            </Pressable>


        </ScrollView>
        </KeyboardAvoidingView>
    </View>
  )
}

export default ThesisScore

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
