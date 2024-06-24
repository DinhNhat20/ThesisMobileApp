import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment'
import MyStyles from '../../styles/MyStyles'
import { List } from 'react-native-paper'

const CouncilItem = ({instance}) => {
    return (
        <List.Item style={[MyStyles.margin, styles.itemContainer]}
        title={() => (
            <View>
                <Text style={[MyStyles.text03]}>{instance.name}</Text>
                <Text style={[MyStyles.text02]}>Vai trò: {instance.details[0].position}</Text>
                <Text style={[MyStyles.text02]}>
                    Trạng thái: {instance.active ? 'mở' : 'khóa'}
                </Text>
            </View>
        )} 
        description={instance.created_date?moment(instance.created_date).fromNow():""} left={() => <Image style={MyStyles.image} source={require('../../components/images/logo_uni.webp')}/>}  />
      )
}

export default CouncilItem

const styles = StyleSheet.create({
    title: {
        flex: 1,
        flexWrap: 'wrap',
    },
    itemContainer: {
        borderWidth: 1, // Độ dày của border
        borderColor: 'black', // Màu của border
        borderRadius: 10, // Bo góc của border, bạn có thể thay đổi hoặc bỏ nếu không cần thiết
        padding: 10, // Khoảng cách bên trong để nội dung không dính vào border
    },
})