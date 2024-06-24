import { StyleSheet, Text, View, TextInput, Pressable, SafeAreaView, Button, FlatList, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import MyStyles from '../../styles/MyStyles'
import APIS, { authAPI, endpoint } from '../../configs/APIS'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';
import SelectItem from '../Common/SelectItem';
import SelectItems from '../Common/SelectItems';
import DataItem from '../Common/DataItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import SelectReviewer from '../Common/SelectReviewer';





const AddThesis = ({navigation}) => {
    // const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);
    const [roles, setRoles] = useState([]);

    const [thesisCode, setThesisCode] = useState('');
    const [thesisName, setThesisName] = useState('');


    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const [students, setStudents] = useState(null);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [StudentsVisible, setStudentsVisible] = useState(false);

    const [lecturers, setLecturers] = useState([]);
    const [selectedLecturers, setSelectedLecturers] = useState([]);
    const [lecturersVisible, setLecturersVisible] = useState(false);

    const [reviewers, setReviewers] = useState([]);
    const [selectedReviewerValue, setSelectedReviewerValue] = useState([]);
    const [reviewerVisible, setReviewerVisible] = useState(false);

    const [majors, setMajors] = useState(null);
    const [selectedMajorValue, setSelectedMajorValue] = useState(null);
    const [majorsVisible, setMajorsVisible] = useState(false);

    const [schoolYears, setSchoolYears] = useState(null);
    const [selectedSchoolYearValue, setSelectedSchoolYearValue] = useState(null);
    const [selectedSchoolYearValueShow, setSelectedSchoolYearValueShow] = useState(null);
    const [schoolYearsVisible, setSchoolYearsVisible] = useState(false);

    const [councils, setCouncils] = useState(null);
    const [selectedCouncilValue, setSelectedCouncilValue] = useState(null);
    const [councilsVisible, setCouncilsVisible] = useState(false);
    
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [loading, setLoading] = useState(false);

    const handleStartDateChange = (selectedDate) => {
        setStartDate(selectedDate);
    };

    const handleEndDateChange = (selectedDate) => {
      setEndDate(selectedDate);
    };

    const loadRoles = async () => {
      try {
          let res = await APIS.get(endpoint['roles'])
          setRoles(res.data)
      } catch (ex) {
          console.error(ex)
      }
    }

    const loadMajors = async () => {
      try {
          let res = await APIS.get(endpoint['majors'])
          setMajors(res.data)
      } catch (ex) {
          console.error(ex)
      }
    }

    const loadSchoolYears = async () => {
      try {
          let res = await APIS.get(endpoint['school_years'])
          setSchoolYears(res.data)
      } catch (ex) {
          console.error(ex)
      }
    }

    const loadCouncils = async () => {
      try {
          let token = await AsyncStorage.getItem("token");
          let res = await authAPI(token).get('councils-contain-than-5-thesis');
          setCouncils(res.data)
          console.info(councils)
      } catch (ex) {
          console.error(ex)
      }
    }

    const loadStudents = async () => {
      try {
          let res = await APIS.get(endpoint['students-without-thesis'])
          setStudents(res.data)
      } catch (ex) {
          console.error(ex)
      }
    }

    const loadLecturers = async () => {
      try {
          let token = await AsyncStorage.getItem("token");
          let res = await authAPI(token).get(endpoint['lecturers'])
          setLecturers(res.data)
          setReviewers(res.data)
      } catch (ex) {
          console.error(ex)
      }
    }

    useEffect(() => {
      loadRoles();
    }, []);

    useEffect(() => {
      loadMajors();
    }, []);

    useEffect(() => {
      loadSchoolYears();
    }, []);

    useEffect(() => {
      loadCouncils();
    }, []);

    useEffect(() => {
      loadStudents();
    }, []);

    useEffect(() => {
      loadLecturers();
    }, []);

  
  // Hàm xử lý khi người dùng chọn một item
  const handleLecturerPress = (item) => {
    if (selectedLecturers.includes(item)) {
        setSelectedLecturers(selectedLecturers.filter(selectedLecturer => selectedLecturer !== item));
    } else {
      setSelectedLecturers([...selectedLecturers, item]);
    }
};


// Hiển thị ra các sinh viên được chọn
const renderStudents = ({ item }) => (
  <TouchableOpacity
    style={[MyStyles.roleItem, selectedStudents.includes(item) && MyStyles.selectedRoleItem]}
    onPress={() => {
      if (selectedStudents.includes(item)) {
        setSelectedStudents(selectedStudents.filter(student => student !== item));
      } else {
        setSelectedStudents([...selectedStudents, item]);
      }
    }}
  >
    <Text style={[MyStyles.margin, MyStyles.text]}>{item.full_name}</Text>
  </TouchableOpacity>
);

// Hiển thị ra các giảng viên được chọn
const renderLecturers = ({ item }) => (
  <TouchableOpacity
    style={[MyStyles.roleItem, selectedLecturers.includes(item) && MyStyles.selectedRoleItem]}
    onPress={() => {
      if (selectedLecturers.includes(item)) {
        setSelectedLecturers(selectedLecturers.filter(lecturer => lecturer !== item)); // Xóa giảng viên ra khỏi danh sách đã được chọn
      } else {
        setSelectedLecturers([...selectedLecturers, item]); // Thêm giảng viên vào trong danh sách
      }
    }}
  >
    <Text style={[MyStyles.margin, MyStyles.text]}>{item.full_name}</Text>
  </TouchableOpacity>
);


  // Hàm xử lý khi người dùng chọn một item
  const handleStudentPress = (item) => {
    if (selectedStudents.includes(item)) {
        setSelectedStudents(selectedStudents.filter(selectedStudent => selectedStudent !== item));
    } else {
      setSelectedStudents([...selectedStudents, item]);
    }
};



    const renderItem = ({ item }) => (
      <View style={[MyStyles.container]}>
        <TouchableOpacity
          style={[MyStyles.text05]}
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
  
    // Function xử lý khi ấn button lưu thông tin(Tạo khóa luận)
    const handleSubmit = async () => {
      setLoading(true);
      try {

        // Kiểm tra số lượng giảng viên hướng dẫn
        if (selectedLecturers.length > 2) {
          alert('1 khóa luận chỉ có tối đa 2 giảng viên hướng dẫn');
          setLoading(false);
          return;
        }

        // Kiểm tra xem các giảng viên hướng dẫn có trùng với giảng viên phản biện không
        if (selectedLecturers.some(lecturer => lecturer.user === selectedReviewerValue)) {
          alert('Giảng viên phản biện không được trùng với giảng viên hướng dẫn');
          setLoading(false);
          return;
        }


        const res = await APIS.post(endpoint['theses01'], {
          code: thesisCode,
          name: thesisName,
          start_date: startDate.toISOString().split('T')[0],
          complete_date: endDate.toISOString().split('T')[0],
          major: selectedMajorValue,
          school_year: selectedSchoolYearValue,
          council: selectedCouncilValue,
          reviewer: selectedReviewerValue,
        });
    
        if (res.status === 201) {
          const createdThesis = res.data;
    
          // Cập nhật khóa luận cho từng sinh viên được chọn
          const updateStudents = selectedStudents.map(async (student) => {
            const updatedStudent = { ...student };
            updatedStudent.thesis = createdThesis.id;
    
            try {
              let token = await AsyncStorage.getItem("token");
              const updateRes = await authAPI(token).patch(`students/${student.user}/`, updatedStudent);
              console.log(`Sinh viên ${student.user} đã được cập nhật với khóa luận ${createdThesis.id}`);
              return updateRes.data;
            } catch (ex) {
              console.error(`Lỗi khi cập nhật sinh viên ${student.user}: `, ex);
              throw ex; // Xử lý lỗi tại đây nếu cần
            }
          });
    
          // Thực thi cập nhật cho các sinh viên
          await Promise.all(updateStudents);

          // Tạo các dòng giảng viên hướng dẫn trong bảng supervisors
          const createSupervisors = selectedLecturers.map(async (lecturer) => {
            try {
              const supervisorData = {
                lecturer: lecturer.user,
                thesis: createdThesis.id,
              };
              const supervisorRes = await APIS.post(endpoint['supervisors'], supervisorData);
              console.log(`Supervisor created: ${supervisorRes.data}`);
              return supervisorRes.data;
            } catch (ex) {
              console.error(`Lỗi khi tạo dữ liệu giảng viên hướng dẫn ${lecturer.user}: `, ex);
              throw ex; // Handle error here if needed
            }
          });

          await Promise.all(createSupervisors);
    
          // Hiển thị thông báo thành công cho người dùng
          alert('Khóa luận được thêm thành công');

          // Quay trở về màn hình và load lại ThesisList
          navigation.navigate('ThesisList', { reload: true });
    
          // Đặt lại các trường trong biểu mẫu
          setThesisCode('');
          setThesisName('');
          setStartDate(new Date());
          setEndDate(new Date());
          setSelectedMajorValue(null);
          setSelectedSchoolYearValue(null);
          setSelectedCouncilValue(null);
          setSelectedReviewerValue(null);
          setSelectedStudents([]);
          setSelectedLecturers([]);
        }
      } catch (ex) {
        console.error('Lỗi khi tạo khóa luận: ', ex);
      } finally {
        setLoading(false);
      }
    };

  return (
    <ScrollView>  
        <View style={[MyStyles.container, MyStyles.padding]}>
            <Text style={[MyStyles.text, {marginBottom: 20}, {color: '#1877F2'}]}>THÊM KHÓA LUẬN</Text>
            <SafeAreaView>
                <Text style={[MyStyles.text02]}>Mã khóa luận</Text>
                <TextInput 
                  style={[MyStyles.input, MyStyles.text02]} 
                  placeholder='Mã khóa luận...'
                  value={thesisCode}
                  onChangeText={setThesisCode}>
                </TextInput>

                <Text style={[MyStyles.text02]}>Tên khóa luận</Text>
                <TextInput 
                  style={[MyStyles.input, MyStyles.text02]} 
                  placeholder='Tên khóa luận...'
                  value={thesisName}
                  onChangeText={setThesisName}>
                </TextInput>

                <Text style={[MyStyles.text02]}>Ngày bắt đầu</Text>
                <View style={[MyStyles.input, MyStyles.text02]}>
                  <DataItem value={startDate} onChange={handleStartDateChange} />
                </View>

                <Text style={[MyStyles.text02]}>Ngày hoàn thành</Text>
                <View style={[MyStyles.input, MyStyles.text02]}>
                  <DataItem value={endDate} onChange={handleEndDateChange} />
                </View>

                
            {/* Sinh viên thực hiện */}
            <View>
              <SelectItems
                title="Sinh viên thực hiện"
                items={students}
                selectedItems={selectedStudents}
                renderItems={renderStudents}
                itemsVisible={StudentsVisible}
                setItemsVisible={setStudentsVisible}
              />
            </View>


            {/* Giảng viên hướng dẫn */}
            <View>
              <SelectItems
                title="Giảng viên hướng dẫn"
                items={lecturers}
                selectedItems={selectedLecturers}
                renderItems={renderLecturers}
                itemsVisible={lecturersVisible}
                setItemsVisible={setLecturersVisible}
              />
            </View>


            <View>
            <SelectReviewer
              title = "Giáo viên phản biện"
              selectedItemValue={selectedReviewerValue}
              setSelectedItemValue={setSelectedReviewerValue}
              Items={reviewers}
              keyName="full_name"
              setItemsVisible={setReviewerVisible}
              itemsVisible={reviewerVisible}
            />
          </View>


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
                <View style={[{flex:1}, MyStyles.text05, {justifyContent: "center"}, {alignItems: "center"}, {backgroundColor: 'rgba(0, 0, 0, 0.5)'}, {paddingTop: 200}, {paddingBottom: 200}, {paddingRight: 100}, {paddingLeft: 100}]}>
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
            <SelectItem
              title = "Chuyên nghành"
              selectedItemValue={selectedMajorValue}
              setSelectedItemValue={setSelectedMajorValue}
              Items={majors}
              keyName="name"
              setItemsVisible={setMajorsVisible}
              itemsVisible={majorsVisible}
            />
          </View>

          <View>
            <SelectItem
              title = "Hội đồng"
              selectedItemValue={selectedCouncilValue}
              setSelectedItemValue={setSelectedCouncilValue}
              Items={councils}
              keyName="name"
              setItemsVisible={setCouncilsVisible}
              itemsVisible={councilsVisible}
            />
          </View>


          <Pressable style={MyStyles.btnLogin} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={MyStyles.textLogin}>Lưu thông tin</Text>
            )}
          </Pressable>

            </SafeAreaView>
        </View>
    </ScrollView>
  )
}

export default AddThesis

const styles = StyleSheet.create({

})