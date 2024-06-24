import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, Modal, View, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import APIS, { authAPI, endpoint } from '../../configs/APIS'
import SelectPosition from '../Common/SelectPosition'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ActivityIndicator } from 'react-native-paper'

const AddCouncil = ({navigation}) => {
    const [schoolYears, setSchoolYears] = useState(null);
    const [selectedSchoolYearValue, setSelectedSchoolYearValue] = useState(null);
    const [selectedSchoolYearValueShow, setSelectedSchoolYearValueShow] = useState(null);
    const [schoolYearsVisible, setSchoolYearsVisible] = useState(false);

    const [lecturers, setLecturers] = useState([]);

    const [councilName, setCouncilName] = useState('');
    const [description, setDescription] = useState('');

    const [selectedPresident, setSelectedPresident] = useState(null);
    const [presidentVisible, setPresidentVisible] = useState(false);

    const [selectedSecretary, setSelectedSecretary] = useState(null);
    const [secretaryVisible, setSecretaryVisible] = useState(false);

    const [selectedReviewer, setSelectedReviewer] = useState(null);
    const [reviewerVisible, setReviewerVisible] = useState(false);

    const [selectedMember01, setSelectedMember01] = useState(null);
    const [member01Visible, setMember01Visible] = useState(false);

    const [selectedMember02, setSelectedMember02] = useState(null);
    const [member02Visible, setMember02Visible] = useState(false);

    const [loading, setLoading] = useState(false);


    const loadSchoolYears = async () => {
        try {
            let res = await APIS.get(endpoint['school_years'])
            setSchoolYears(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }
    useEffect(() => {
        loadSchoolYears();
      }, []);

    const loadLecturers = async () => {
        try {
            let token = await AsyncStorage.getItem("token");
            let res = await authAPI(token).get(endpoint['lecturers'])
            setLecturers(res.data)
        } catch (ex) {
            console.error(ex)
        }
    }
    useEffect(() => {
        loadLecturers();
      }, []);

      const renderItem = ({ item }) => (
        <View style={[MyStyles.container]}>
          <TouchableOpacity
            style={[]}
            onPress={() => {
              setSelectedSchoolYearValue(item.id);
              setSelectedSchoolYearValueShow(`${new Date(item.start_year).getFullYear()} - ${new Date(item.end_year).getFullYear()}`);
              setSchoolYearsVisible(false);
            }}
          >
            <Text style={[MyStyles.text05, MyStyles.textInput01]}>{new Date(item.start_year).getFullYear()} - {new Date(item.end_year).getFullYear()}</Text>
          </TouchableOpacity>
        </View>
      );

      // Kiểm tra có bị trùng giảng viên trong hội đồng hay không
      const checkDuplicateLecturers = () => {
        const selectedLecturers = [
          selectedPresident,
          selectedSecretary,
          selectedReviewer,
          selectedMember01,
          selectedMember02
        ];
      
        const lecturerCounts = selectedLecturers.reduce((acc, lecturer) => {
          if (lecturer) {
            acc[lecturer] = (acc[lecturer] || 0) + 1;
          }
          return acc;
        }, {});
      
        for (let count of Object.values(lecturerCounts)) {
          if (count > 1) {
            return true; // 1 giảng viên được chọn nhiều hơn 1 lần
          }
        }
        return false;
      };
      

      // Kiểm tra các vai trò bắt buộc
      const checkRequiredPositions = () => {
        if (!selectedPresident || !selectedSecretary || !selectedReviewer) {
            return false;
        }
        return true;
      };

      // Function tạo hội đồng
      const createCouncil = async () => {
        if (checkDuplicateLecturers()) {
          alert('Một giảng viên chỉ được đảm nhiệm 1 vai trò trong hội đồng. Vui lòng chọn lại.');
          return;
        }

        if (!checkRequiredPositions()) {
          alert('Hội đồng phải có tối thiểu 3 thành viên là: Chủ tịch, Thư ký và Phản biện.');
          setLoading(false);
          return;
        }

        setLoading(true);
        const token = await AsyncStorage.getItem('token');

        const councilData = {
            name: councilName,
            description: description,
            schoolyear: selectedSchoolYearValue,
        };

        try {
          const res = await authAPI(token).post(endpoint['councils01'], councilData);
          const councilId = res.data.id;

          const councilDetails = [
            { position: 1, lecturer: selectedPresident, council: councilId },
            { position: 2, lecturer: selectedSecretary, council: councilId },
            { position: 3, lecturer: selectedReviewer, council: councilId },
          ];

          if (selectedMember01) {
              councilDetails.push({ position: 4, lecturer: selectedMember01, council: councilId });
          }

          if (selectedMember02) {
              councilDetails.push({ position: 5, lecturer: selectedMember02, council: councilId });
          }

          for (const detail of councilDetails) {
              await authAPI(token).post(endpoint['create_council_detail'], detail);
          }

          alert('Thêm hội đồng thành công');

          navigation.navigate('CouncilList', { reload: true });
        } catch (error) {
            console.error(error);
            alert('Thêm hội đồng thất bại');
        } finally {
          setLoading(false);
        }
      };

  return (
    <ScrollView>
      <View style={[MyStyles.container, MyStyles.padding]}>
        <View style={MyStyles.container}> 
            <Text style={[MyStyles.text, {marginBottom: 20}, {color: '#1877F2'}]}>THÀNH LẬP HỘI ĐỒNG</Text>

            <SafeAreaView>
            <Text style={[MyStyles.text02]}>Tên hội đồng</Text>
            <TextInput 
              style={[MyStyles.input, MyStyles.text02]} 
              placeholder='Tên hội đồng...'
              value={councilName}
              onChangeText={setCouncilName}>
            </TextInput>

            <Text style={[MyStyles.text02]}>Mô tả</Text>
            <TextInput 
              style={[MyStyles.input, MyStyles.text02]} 
              placeholder='Mô tả...'
              value={description}
              onChangeText={setDescription}>
            </TextInput>

            {/* Niên khóa */}
            <Text style={[MyStyles.text02]}>Niên khóa</Text>
            <View>
              <TouchableOpacity onPress={() => setSchoolYearsVisible(true)}>
                <View style={[MyStyles.input]}>
                  <Text style={MyStyles.textInput}>{selectedSchoolYearValueShow || 'Chọn niên khóa'}</Text>
                </View>
              </TouchableOpacity>
              <Modal
                animationType="slide"
                transparent={true}
                visible={schoolYearsVisible}
                onRequestClose={() => {
                  setSchoolYearsVisible(!schoolYearsVisible);
                }}
              >
                <View style={[{flex:1}, {justifyContent: "center"}, {alignItems: "center"}, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}, {paddingTop: 200}, {paddingBottom: 200}, {paddingRight: 100}, {paddingLeft: 100}]}>
                  <View style={{ backgroundColor: '#fff', padding: 20, borderRadius: 10 }}>
                    <FlatList
                      data={schoolYears}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                    />
                    <TouchableOpacity onPress={() => setSchoolYearsVisible(false)}>
                      <Text style={MyStyles.text02}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
            </View>



            <View>
            <SelectPosition
              title = "Chủ tịch"
              selectedItemValue={selectedPresident}
              setSelectedItemValue={setSelectedPresident}
              Items={lecturers}
              setItemsVisible={setPresidentVisible}
              itemsVisible={presidentVisible}
            />
          </View>


          <View>
            <SelectPosition
              title = "Thư ký"
              selectedItemValue={selectedSecretary}
              setSelectedItemValue={setSelectedSecretary}
              Items={lecturers}
              setItemsVisible={setSecretaryVisible}
              itemsVisible={secretaryVisible}
            />
          </View>

          <View>
            <SelectPosition
              title = "Phản biện"
              selectedItemValue={selectedReviewer}
              setSelectedItemValue={setSelectedReviewer}
              Items={lecturers}
              setItemsVisible={setReviewerVisible}
              itemsVisible={reviewerVisible}
            />
          </View>

          <View>
            <SelectPosition
              title = "Thành viên 01"
              selectedItemValue={selectedMember01}
              setSelectedItemValue={setSelectedMember01}
              Items={lecturers}
              setItemsVisible={setMember01Visible}
              itemsVisible={member01Visible}
            />
          </View>

          <View>
            <SelectPosition
              title = "Thành viên 02"
              selectedItemValue={selectedMember02}
              setSelectedItemValue={setSelectedMember02}
              Items={lecturers}
              setItemsVisible={setMember02Visible}
              itemsVisible={member02Visible}
            />
          </View>

          </SafeAreaView>

          <Pressable style={MyStyles.btnLogin} onPress={createCouncil}>
            {loading ? (
            <ActivityIndicator color="#FFFFFF" />
            ) : (
            <Text style={MyStyles.textLogin}>Lưu thông tin</Text>
            )}
          </Pressable>

        </View>
      </View>
    </ScrollView>
  )
}

export default AddCouncil

const styles = StyleSheet.create({})