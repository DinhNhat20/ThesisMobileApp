import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import ThesisItem from '../Common/ThesisItem'
import { ActivityIndicator, Button, Chip, List, Searchbar } from 'react-native-paper'
import APIS, { endpoint } from '../../configs/APIS'
import { isCloseToBottom } from '../../configs/Utils'

const Thesis = ({navigation}) => {
    const [majors, setMajors] = useState(null)
    const [theses, setTheses] = useState([])
    const [loading, setLoading] = useState(false)
    const [q, setQ] = useState("")
    const [majorId, setMajorId] = useState("")
    const [page, setPage] = useState(1)

    const loadMajors = async () => {
        try {
            let res = await APIS.get(endpoint['majors'])
            setMajors(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }
    
    const loadTheses = async () => {
        if (page > 0) {
          setLoading(true)
          try {
              let url = `${endpoint['theses01']}?q=${q}&major=${majorId}&page=${page}`;
  
              let res = await APIS.get(url)
  
              if (res.data.next === null)
                setPage(0)
  
              if (page === 1)
                setTheses(res.data.results)
              else
                setTheses(current => {
                  return [...current, ...res.data.results]
                })
          } catch (ex) {
              console.error(ex)
          } finally {
              setLoading(false)
          }
        }
      } 

    // gọi hàm loadCates 1 lần khi nạp các component
    useEffect(() => {
        loadMajors()
    }, [])
    
    useEffect(() => {
        loadTheses()
    }, [q, majorId, page])

      
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setPage(1);
        loadTheses();
      });
  
      return unsubscribe;
    }, [navigation]);

    const loadMore = ({nativeEvent}) => {
        if (!loading && page > 0 && isCloseToBottom(nativeEvent)) {
          setPage(page + 1)
        }
      }
  
      const search = (value, callback) => {
        setPage(1)
        callback(value)
      }

      const goAddThesis = () => {
        navigation.navigate('AddThesis');
      }

  return (
    <View style={MyStyles.container}>
      <View style={[MyStyles.row, MyStyles.wrap]}>
        <Chip mode={!majorId?"outlined":"flat"} style={MyStyles.margin} onPress={() => search("", setMajorId)} icon="information">Tất cả</Chip>
        {majors===null?<ActivityIndicator/>:<>
        {majors.map(c => <Chip mode={c.id===majorId?"outlined":"flat"} style={MyStyles.margin} key={c.id} onPress={() => search(c.id, setMajorId)} icon="information">{c.name}</Chip>)}
      </>}
      </View>

      <View>
        <Searchbar
        placeholder="Nhập từ khóa..."
        onChangeText={(t) => search(t, setQ)}
        value={q}
        />
      </View>

      <ScrollView onScroll={loadMore}>
        <RefreshControl onRefresh={() => loadTheses()}/>
        {theses.map(c => <TouchableOpacity key={c.id}>
          <ThesisItem instance={c}/>
        </TouchableOpacity>)}
        {loading && page > 1 && <ActivityIndicator/>}       
      </ScrollView>

      <View style={[styles.margin]}>
          <Button mode="contained" loading={loading} onPress={goAddThesis}>Thêm khóa luận</Button>
        </View>
    </View>
  )
}

export default Thesis

const styles = StyleSheet.create({
  margin: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
  }
})