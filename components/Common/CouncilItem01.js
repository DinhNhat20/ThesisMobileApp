import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment'
import MyStyles from '../../styles/MyStyles'
import { List } from 'react-native-paper'

const CouncilItem01 = ({instance}) => {
    return (
        <List.Item style={[MyStyles.margin, styles.itemContainer]}
        title={() => (
            <View>
                <Text style={[MyStyles.text02]}>
                    {instance.name}
                </Text>
                <Text style={[MyStyles.text02]}>
                    Mô tả: {instance.description ? (instance.description): 'không có mô tả'}
                </Text>
            </View>
        )} 
        description={instance.created_date?moment(instance.created_date).fromNow():""} left={() => <Image style={MyStyles.image} source={require('../../components/images/logo_uni.webp')}/>}  />
      )
}

export default CouncilItem01

const styles = StyleSheet.create({
    title: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 14,
        color: '#4E4B66'
    },
    itemContainer: {
        borderWidth: 1, // Độ dày của border
        borderColor: 'black', // Màu của border
        borderRadius: 10, // Bo góc của border, bạn có thể thay đổi hoặc bỏ nếu không cần thiết
        padding: 3, // Khoảng cách bên trong để nội dung không dính vào border
    },
    padding: {
        padding: 5
    }
})