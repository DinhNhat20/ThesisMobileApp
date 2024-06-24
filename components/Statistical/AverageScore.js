import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'
import APIS, { endpoint } from '../../configs/APIS';
import { LineChart, PieChart } from 'react-native-chart-kit';

const AverageScore = () => {
    const[data, setData] = useState(null);
    const[data01, setData01] = useState(null);
    
    const loadData = async () => {
        try {
            let res = await APIS.get(endpoint['average-score-by-school-year']);
            // Chuyển đổi start_year và end_year thành chỉ có năm
            const formattedData = res.data.map(item => ({
                ...item,
                school_year: `${new Date(item.school_year__start_year).getFullYear()}-${new Date(item.school_year__end_year).getFullYear()}`
            }));
            setData(formattedData);
            console.info(formattedData);
        } catch (error) {
            console.error(error);
        }
    }

    const loadData01 = async () => {
        try {
            let res = await APIS.get(endpoint['major_frequency']);
            setData01(res.data);
            console.info(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadData();
        loadData01();
    }, []);

    const chartData = {
        labels: data ? data.map(item => item.school_year) : [],
        datasets: [
            {
                data: data ? data.map(item => item.avg_score) : [],
            },
        ],
    };

    const chartData01 = data01 ? data01.map((item, index) => ({
        name: item.name,
        thesis_count: item.thesis_count,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 18
    })) : [];

  return (
    <ScrollView>
        <View style={styles.container}>
            <View style={[styles.margin]}>
                <Text style={styles.title}>ĐIỂM TRUNG BÌNH CÁC KHÓA LUẬN QUA CÁC NĂM HỌC</Text>
                {data ? (
                    <LineChart
                        data={chartData}
                        width={Dimensions.get('window').width - 20} // width của biểu đồ
                        height={220} // height của biểu đồ
                        chartConfig={{
                            backgroundColor: '#e26a00',
                            backgroundGradientFrom: '#fb8c00',
                            backgroundGradientTo: '#ffa726',
                            decimalPlaces: 2, // số chữ số thập phân
                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: {
                                borderRadius: 16,
                            },
                        }}
                        bezier
                        style={{
                            marginVertical: 8,
                            borderRadius: 16,
                        }}
                    />
                ) : (
                    <Text>Loading...</Text>
                )}
            </View>

            <View style={[styles.margin]}>
                <Text style={styles.title}>TẦN SUẤT THỰC HIỆN KHÓA LUẬN CỦA TỪNG NGHÀNH</Text>
                {data01 ? (
                    <PieChart
                        data={chartData01}
                        width={Dimensions.get('window').width - 20} // from react-native
                        height={240}
                        chartConfig={{
                            backgroundColor: '#ffffff',
                            backgroundGradientFrom: '#ffffff',
                            backgroundGradientTo: '#ffffff',
                            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            strokeWidth: 2, // optional, default 3
                            barPercentage: 0.5,
                        }}
                        accessor="thesis_count"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute //show percentagesx`
                    />
                ) : (
                    <Text>Loading...</Text>
                )}            
            </View>
        </View>        
    </ScrollView>
  )
}

export default AverageScore

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    margin: {
        margin: 30,
    }
})