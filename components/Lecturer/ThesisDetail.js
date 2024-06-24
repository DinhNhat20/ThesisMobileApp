import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import APIS, { authAPI, endpoint } from '../../configs/APIS'
import MyStyles from '../../styles/MyStyles'
import { Button } from 'react-native-paper'

// Thông tin chi tiết của 1 khóa luận

const ThesisDetail = ({navigation, route, token}) => {
    const [thesis, setThesis] = useState(null)
    const thesisId = route.params?.thesisId
    const CouncilDetailsId = route.params?.CouncilDetailsId;
    const [loading, setLoading] = useState(false);
    const [isScored, setIsScored] = useState(true);

    const loadThesis = async () => {
        try {
            let res = await APIS.get(endpoint['thesis-details'](thesisId));
            res.data.name = res.data.name.toUpperCase();
            setThesis(res.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            loadThesis();
            checkScoreOnMount();
        });

        return unsubscribe;
    }, [navigation]);

    // Kiểm tra khóa luận đã được chấm điểm hay chưa
    const checkScoreOnMount = async () => {
        try {
            const checkResponse = await authAPI(token).get(endpoint['thesis_scores'], {
                params: {
                    council_detail: CouncilDetailsId,
                    thesis: thesisId,
                },
            });

            setIsScored(checkResponse.data.length === 0);
        } catch (err) {
            console.error('Lỗi khi kiểm tra khóa luận có được chấm điểm hay chưa:', err);
        }
    };

    // Function định dạng dữ liệu ngày tháng để hiển thị ra cho người dùng
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const year = date.getFullYear()
        return `${day}/${month}/${year}`
    }

    // Function kiểm tra và thêm đối tượng ThesisScore để có thể chấm điểm
    const checkAndAddThesisScore = async () => {
        try {
            const checkResponse = await authAPI(token).get(endpoint['thesis_scores'], {
                params: {
                    council_detail: CouncilDetailsId,
                    thesis: thesisId
                }
            });
    
            if (checkResponse.data.length === 0) {
                const data = {
                    council_detail: CouncilDetailsId,
                    thesis: thesisId
                };
                const response = await authAPI(token).post(endpoint['thesis_scores'], data);
                return response.data.id;
            } else {
                return checkResponse.data[0].id;
            }
        } catch (err) {
            console.error('Lỗi chấm điểm khóa luận:', err);
            return null;
        }
    }

    // Di chuyển đến màn hình chấm điểm
    const goThesisScore = (thesisScoreId) => {
        navigation.navigate('ThesisScore', { thesisId, thesisScoreId });
    };

    // Di chuyển đến màn hình sửa điểm
    const goUpdateThesisScore = (thesisScoreId) => {
        navigation.navigate('UpdateThesisScore', { thesisId, thesisScoreId, CouncilDetailsId });
    };

    // Function xử lý khi ấn button chấm điểm
    const handleButtonPress = async () => {
        const thesisScoreId = await checkAndAddThesisScore();
        if (thesisScoreId) {
            goThesisScore(thesisScoreId);
        } else {
            console.error('Lỗi chấm điểm khóa luận');
        }
    };

    // Function xử lý khi ấn button sửa điểm
    const handleButtonPress01 = async () => {
        const thesisScoreId = await checkAndAddThesisScore();
        if (thesisScoreId) {
            goUpdateThesisScore(thesisScoreId); 
        } else {
            console.error('Lỗi chấm điểm khóa luận');
        }
    };

  return (
    <ScrollView>
        <View style={[MyStyles.container, MyStyles.maginTop, MyStyles.padding]}>
        {thesis===null?<ActivityIndicator/>:<>
            <Text style={[MyStyles.text]}>{thesis.name}</Text>
            <Text style={[MyStyles.text05]}>Mã khóa luận: {thesis.code}</Text>
            <Text style={[MyStyles.text05]}>Ngày bắt đầu: {formatDate(thesis.start_date)}</Text>
            <Text style={[MyStyles.text05]}>Ngày hoàn thành: {formatDate(thesis.complete_date)}</Text>
            <Text style={[MyStyles.text05]}>Chuyên ngành: {thesis.major.name}</Text>
            <Text style={[MyStyles.text05]}>Năm học: {`${new Date(thesis.school_year.start_year).getFullYear()} - ${new Date(thesis.school_year.end_year).getFullYear()}`}</Text>
            <Text style={[MyStyles.text05]}>Điểm trung bình hiện tại: {thesis.average_score}</Text>
            <Text style={[MyStyles.text05]}>File báo cáo: {thesis.report_file || "Không có"}</Text>

            <Text style={[MyStyles.text05, {color: '#1877F2'}]}>
                Trạng thái: {isScored ? 'Chưa chấm điểm' : 'Đã chấm điểm'}
            </Text>

            <View style={[MyStyles.container]}>
                {isScored ? <Button style={[styles.maginTop]} mode="contained" loading={loading} onPress={handleButtonPress}>Chấm điểm</Button> : <Button style={[styles.maginTop]} mode="contained" loading={loading} onPress={handleButtonPress01}>Sửa điểm</Button> }
            </View>
        </>}
        </View>
    </ScrollView>
  )
}

export default ThesisDetail

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 24,
    }
})