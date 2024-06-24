import React, { useContext, useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MyUserContext } from '../../configs/Context';
import APIS, { authAPI, endpoint } from '../../configs/APIS';
import MyStyles from '../../styles/MyStyles';
import { ActivityIndicator, Button } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadFileThesis = () => {
    const user = useContext(MyUserContext);
    const [thesis, setThesis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileName, setFileName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [reviewer, setReviewer] = useState(null);


    const loadThesisOfStudent = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await authAPI(token).get(endpoint['students_id'](user.id));
            const thesisId = res.data.thesis;
            let resThesis = await APIS.get(endpoint['thesis-details'](thesisId));
            resThesis.data.name = resThesis.data.name.toUpperCase();
            setThesis(resThesis.data);

            let resReviewer = await authAPI(token).get(endpoint['lecturers_id'](resThesis.data.reviewer));
            setReviewer(resReviewer.data);
            
        } catch {
            Alert.alert("Thông báo", "Sinh viên chưa có khóa luận");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadThesisOfStudent();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleUpload = async () => {
        setLoading(true);
        try {
            let token = await AsyncStorage.getItem("token");
            let resStudent = await authAPI(token).get(endpoint['students_id'](user.id));
            const thesisId = resStudent.data.thesis;
            const res = await APIS.patch(endpoint['thesis-details'](thesisId), { report_file: fileName });
            alert('Upload file thành công');
            setThesis(res.data);
            setIsEditing(false);
        } catch (ex) {
            console.error(ex);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        Clipboard.setString(thesis.report_file);
        Alert.alert("Thông báo", "URL của file đã được sao chép vào clipboard");
    };


    return (
        <ScrollView>
            <View style={[MyStyles.container, MyStyles.maginTop, MyStyles.padding]}>
                {loading ? (
                    <ActivityIndicator />
                ) : thesis === null ? (
                    <Text style={MyStyles.text}>Không có thông tin khóa luận</Text>
                ) : (
                    <>
                        <Text style={MyStyles.text}>{thesis.name}</Text>
                        <Text style={MyStyles.text05}>Mã khóa luận: {thesis.code}</Text>
                        <Text style={MyStyles.text05}>Ngày bắt đầu: {formatDate(thesis.start_date)}</Text>
                        <Text style={MyStyles.text05}>Ngày hoàn thành: {formatDate(thesis.complete_date)}</Text>
                        <Text style={MyStyles.text05}>Giảng viên phản biện:</Text>
                        <Text style={MyStyles.text05}>{reviewer.full_name}</Text>
                        <Text style={MyStyles.text05}>Chuyên ngành:</Text>
                        <Text style={MyStyles.text05}>{thesis.major.name}</Text>
                        <Text style={MyStyles.text05}>Năm học: {`${new Date(thesis.school_year.start_year).getFullYear()} - ${new Date(thesis.school_year.end_year).getFullYear()}`}</Text>
                        <Text style={MyStyles.text05}>Điểm trung bình: {thesis.average_score ? thesis.average_score : 'Chưa chấm điểm'}</Text>

                        {thesis.report_file ? (
                            isEditing ? (
                            <>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder='Nhập file khóa luận...'
                                    value={fileName}
                                    onChangeText={setFileName}
                                />
                                <View style={[MyStyles.container, styles.buttonStyle]}>
                                    <Button style={[MyStyles.margin]} mode="contained" loading={loading} onPress={handleUpload}>Cập nhật file</Button>   
                                    <Button style={[MyStyles.margin]} mode="contained" loading={loading} onPress={() => setIsEditing(false)}>Hủy</Button> 
                                </View>
                            </>
                        ) : (
                            <>
                                <Pressable onPress={copyToClipboard}><Text style={MyStyles.text05}>File báo cáo: {thesis.report_file}</Text></Pressable>
                                <Pressable style={MyStyles.btnLogin} onPress={() => setIsEditing(true)}>
                                    <Text style={MyStyles.textLogin}>Sửa file</Text>
                                </Pressable>
                            </>
                        )
                        ) : (
                            <>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder='Nhập file khóa luận...'
                                    value={fileName}
                                    onChangeText={setFileName}
                                />
                                <Pressable style={MyStyles.btnLogin} onPress={handleUpload}>
                                    {loading ? (
                                        <ActivityIndicator color="#FFFFFF" />
                                    ) : (
                                        <Text style={MyStyles.textLogin}>Upload file</Text>
                                    )}
                                </Pressable>
                            </>
                        )}
                    </>
                )}
            </View>
        </ScrollView>
    );
};

export default UploadFileThesis;

const styles = StyleSheet.create({
    buttonStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 24,
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
    buttonStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
}
});
