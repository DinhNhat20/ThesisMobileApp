import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Button } from 'react-native-paper';
import MyStyles from '../../styles/MyStyles';
import ThesisItem from '../Common/ThesisItem';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';

const TheseOfCouncil = ({route, navigation}) => {
    const councilId = route.params?.CouncilId;
    const councilName = route.params?.CouncilName;
    const active = route.params?.Active;
    const [theses, setThese] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingTheses, setLoadingTheses] = useState(true);


    const loadTheses = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await authAPI(token).get(endpoint['theses_of_council'](councilId));
            setThese(res.data);
            setLoadingTheses(false);
        } catch (ex) {
            console.error(ex);
            setLoadingTheses(false);
        }
    };


    useEffect(() => {
        loadTheses()
    }, [councilId])

    const exportThesesToExcel = async (theses) => {
        const ws = XLSX.utils.json_to_sheet(theses);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Theses');
        const wbout = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' });

        const fileName = `Bảng điểm các khóa luận của hội đồng ${councilName}.xlsx`;
        const uri = FileSystem.cacheDirectory + fileName;
        await FileSystem.writeAsStringAsync(uri, wbout, { encoding: FileSystem.EncodingType.Base64 });
        
        await Sharing.shareAsync(uri);
    };

    const confirmCloseCouncil = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có muốn khóa hội đồng và xuất bảng điểm không?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: closeCouncil },
            ],
            { cancelable: false }
        );
    };

    const confirmOpenCouncil = () => {
        Alert.alert(
            'Xác nhận',
            'Bạn có muốn mở hội đồng không?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'OK', onPress: openCouncil },
            ],
            { cancelable: false }
        );
    };

    const closeCouncil = async() => {
        setLoading(true);
        try {
            await APIS.patch(endpoint['councils01'] + councilId + '/', { active: false }); // Thêm ID của hội đồng vào URL
            alert('Khóa hội đồng thành công');
            await exportThesesToExcel(theses);
            goBack();
        } catch (err) {
            console.error(err)
            alert('Khóa hội đồng thất bại');
        } finally {
            setLoading(false);
        }
    }

    const openCouncil = async () => {
        setLoading(true);
        try {
            await APIS.patch(endpoint['councils01'] + councilId + '/', { active: true }); // Mở hội đồng
            alert('Mở hội đồng thành công');
            goBack();
        } catch (err) {
            console.error(err);
            alert('Mở hội đồng thất bại');
        } finally {
            setLoading(false);
        }
    };

    const goLecturersScores = (ThesisId) => {
        navigation.navigate('LecturersScores', {'LecturersScores': ThesisId});
    }

    const goBack = () => {
        navigation.navigate('CouncilList');
    }


  return (
    <View style={[MyStyles.container, MyStyles.margin]}>
        {loadingTheses ? ( // Hiển thị ActivityIndicator trong khi đang tải dữ liệu
            <ActivityIndicator />
        ) : theses.length === 0 ? ( // Hiển thị thông báo khi không có khóa luận nào
            <Text style={MyStyles.text}>Hiện tại hội đồng không có khóa luận.</Text>
        ) : (
            <>
                {theses.map(l => (
                    <TouchableOpacity key={l.id} onPress={() => goLecturersScores(l.id)}>
                        <ThesisItem instance={l} />
                    </TouchableOpacity>
                ))}
            </>
        )}

      {active ? ( // Hiển thị nút "Khóa hội đồng" nếu hội đồng đang active
            <Button style={[MyStyles.maginTop]} mode="contained" loading={loading} onPress={confirmCloseCouncil}>
                Khóa hội đồng
            </Button>
        ) : ( // Hiển thị nút "Mở hội đồng" nếu hội đồng không active
            <Button style={[MyStyles.maginTop]} mode="contained" loading={loading} onPress={confirmOpenCouncil}>
                Mở hội đồng
            </Button>
        )}
    </View>
  )
}

export default TheseOfCouncil

const styles = StyleSheet.create({})