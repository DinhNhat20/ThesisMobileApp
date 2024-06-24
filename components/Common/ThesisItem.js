import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import moment from 'moment'
import MyStyles from '../../styles/MyStyles'
import { List } from 'react-native-paper'

const ThesisItem = ({instance}) => {
    return (
        <List.Item style={[MyStyles.margin, styles.itemContainer]}
        title={() => (
            <View>
                <Text style={[MyStyles.text02]}>
                    {instance.name}
                </Text>
                <Text style={[MyStyles.text02]}>
                    Mã khóa luận: {instance.code}
                </Text>
            </View>
        )} 
        description={instance.created_date?moment(instance.created_date).fromNow():""} left={() => <Image style={MyStyles.image} source={require('../../components/images/logo_uni.webp')}/>}  />
      )
}

export default ThesisItem

const styles = StyleSheet.create({
    title: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 14,
        color: '#4E4B66'
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 3,
    },
    padding: {
        padding: 5
    }
})