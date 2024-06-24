import { StyleSheet, Text, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import APIS, { endpoint } from '../../configs/APIS';
import { PieChart } from 'react-native-chart-kit';

const MajorFrequency = () => {
    const[data, setData] = useState(null);
    
    const loadData = async () => {
        try {
            let res = await APIS.get(endpoint['major_frequency']);
            setData(res.data);
            console.info(res.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadData();
    }, []);
    

    const chartData = data ? data.map((item, index) => ({
        name: item.name,
        thesis_count: item.thesis_count,
        color: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        legendFontColor: '#7F7F7F',
        legendFontSize: 18
    })) : [];


  return (
    <View style={styles.container}>
        <Text style={styles.title}>TẦN SUẤT THỰC HIỆN KHÓA LUẬN CỦA TỪNG NGHÀNH</Text>
        {data ? (
            <PieChart
                data={chartData}
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
  )
}

export default MajorFrequency

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
})