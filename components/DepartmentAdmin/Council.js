import { Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import { ActivityIndicator, Button, Chip, List, Searchbar } from 'react-native-paper'
import APIS, { endpoint } from '../../configs/APIS'
import { isCloseToBottom } from '../../configs/Utils'
import CouncilItem01 from '../Common/CouncilItem01'

const Council = ({navigation}) => {
    const [schoolYears, setSchoolYears] = useState(null)
    const [councils, setCouncils] = useState([])
    const [loading, setLoading] = useState(false)
    const [q, setQ] = useState("")
    const [schoolYearId, setSchoolYearId] = useState("")
    const [page, setPage] = useState(1)

    const loadSchoolYears = async () => {
        try {
            let res = await APIS.get(endpoint['school_years'])
            setSchoolYears(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }
    
    const loadCouncils = async () => {
        if (page > 0) {
          setLoading(true)
          try {
            let url = `${endpoint['councils01']}?q=${q}&schoolyear=${schoolYearId}&page=${page}`;

            let res = await APIS.get(url)

            if (res.data.next === null)
            setPage(0)

            if (page === 1)
            setCouncils(res.data.results)
            else
            setCouncils(current => {
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
        loadSchoolYears()
    }, [])
    
    useEffect(() => {
        loadCouncils()
    }, [q, schoolYearId, page])

      
    useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        setPage(1);
        loadCouncils();
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

      const goAddCouncil = () => {
        navigation.navigate('AddCouncil');
      }

      const goAddTheseOfCouncil = (CouncilId, CouncilName, Active) => {
        navigation.navigate('TheseOfCouncil', {'CouncilId': CouncilId, 'CouncilName': CouncilName, 'Active': Active});
      }

  return (
    <View style={MyStyles.container}>
      <View style={[MyStyles.row, MyStyles.wrap]}>
        <Chip mode={!schoolYearId?"outlined":"flat"} style={MyStyles.margin} onPress={() => search("", setSchoolYearId)} icon="information">Tất cả</Chip>
        {schoolYears===null?<ActivityIndicator/>:<>
        {schoolYears.map(c => <Chip mode={c.id===schoolYearId?"outlined":"flat"} style={MyStyles.margin} key={c.id} onPress={() => search(c.id, setSchoolYearId)} icon="information">{new Date(c.start_year).getFullYear()} - {new Date(c.end_year).getFullYear()}</Chip>)}
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
        <RefreshControl onRefresh={() => loadCouncils()}/>
        {councils.map(c => <TouchableOpacity key={c.id} onPress={() => goAddTheseOfCouncil(c.id, c.name, c.active)}>
          <CouncilItem01 instance={c}/>
        </TouchableOpacity>)}
        {loading && page > 1 && <ActivityIndicator/>}       
      </ScrollView>

      <View style={[styles.margin]}>
          <Button mode="contained" loading={loading} onPress={goAddCouncil}>Thêm hội đồng</Button>
        </View>
    </View>
  )
}

export default Council

const styles = StyleSheet.create({
  margin: {
    marginTop: 16,
    marginBottom: 16,
    marginLeft: 10,
    marginRight: 10,
  }
})