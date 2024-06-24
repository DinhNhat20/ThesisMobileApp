import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useContext, useReducer } from 'react';
import Register from './components/User/Register';
import Login from './components/User/Login';
import UserProfile from './components/User/UserProfile';
import ChangePassword from './components/User/ChangePassword';
import AddThesis from './components/DepartmentAdmin/AddThesis';
import AddCouncil from './components/DepartmentAdmin/AddCouncil';
import TheseOfCouncil from './components/DepartmentAdmin/TheseOfCouncil';
import LecturersScores from './components/DepartmentAdmin/LecturersScores';
import ThesisScore from './components/Lecturer/ThesisScore';
import UpdateThesisScore from './components/Lecturer/UpdateThesisScore';
import Thesis from './components/DepartmentAdmin/Thesis';
import Thesis01 from './components/Lecturer/Thesis01';
import Council from './components/DepartmentAdmin/Council';
import ThesisDetail from './components/Lecturer/ThesisDetail';
import LecturerCouncils from './components/Lecturer/LecturerCouncils';
import Home from './components/Home/Home';
import UploadFileThesis from './components/Student/UploadFileThesis';
import AverageScore from './components/Statistical/AverageScore';
import MajorFrequency from './components/Statistical/MajorFrequency';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyDispatcherContext, MyUserContext } from './configs/Context';
import { MyUserReducer } from './configs/Reducers';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faRightToBracket, faArrowLeft, faUserPlus, faRectangleList, faUser, faPeopleGroup, faUsersRectangle, faChartLine } from '@fortawesome/free-solid-svg-icons';

library.add(faHome, faRightToBracket, faArrowLeft, faUserPlus, faRectangleList, faUser, faPeopleGroup, faUsersRectangle, faChartLine);


const Stack = createStackNavigator();

const MyStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='ThesisList' component={Thesis} options={{ title: 'Danh sách khóa luận' }} />
      <Stack.Screen name='AddThesis' component={AddThesis} options={{ title: 'Thêm khóa luận' }} />
    </Stack.Navigator>
  );
}

const MyStack01 = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='LecturerCouncils' component={LecturerCouncils} options={{ title: 'Hội đồng' }} />
      <Stack.Screen name='Thesis01' component={Thesis01} options={{ title: 'Danh sách khóa luận' }} />
      <Stack.Screen name='ThesisDetail' component={ThesisDetail} options={{ title: 'Chi tiết khóa luận' }} />
      <Stack.Screen name='ThesisScore' component={ThesisScore} options={{ title: 'Chấm điểm' }} />
      <Stack.Screen name='UpdateThesisScore' component={UpdateThesisScore} options={{ title: 'Sửa điểm' }} />
      <Stack.Screen name='AddCouncil' component={AddCouncil} options={{ title: 'Thêm hội đồng' }} />
    </Stack.Navigator>
  );
}

const MyStack02 = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='UserProfile' component={UserProfile} options={{ title: 'Profile' }} />
      <Stack.Screen name='ChangePassword' component={ChangePassword} options={{ title: 'Đổi mật khẩu' }} />
    </Stack.Navigator>
  );
}

const MyStack03 = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='CouncilList' component={Council} options={{ title: 'Danh sách hội đồng' }} />
      <Stack.Screen name='TheseOfCouncil' component={TheseOfCouncil} options={{ title: 'Danh sách khóa luận của hội đồng' }} />
      <Stack.Screen name='LecturersScores' component={LecturersScores} options={{ title: 'Điểm khóa luận' }} /> 
      <Stack.Screen name='AddCouncil' component={AddCouncil} options={{ title: 'Thêm hội đồng mới' }} />
    </Stack.Navigator>
  );
}

const MyStack04 = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='UploadFileThesis' component={UploadFileThesis} options={{ title: 'Danh sách hội đồng' }} />
      {/* <Stack.Screen name='AddCouncil' component={AddCouncil} options={{ title: 'Thêm hội đồng mới' }} /> */}
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator();
const MyTab = () => {
  const user = useContext(MyUserContext);
  console.info(Math.random())
  console.info("test:" + user)
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} options={{title: "Trang chủ", tabBarIcon: () => <FontAwesomeIcon icon="home" size={24} color="#124f9f" />}} />
      
      
      {user === null ? (
      <>
        <Tab.Screen name="Login" component={Login} options={{title: "Đăng nhập", tabBarIcon: () => <FontAwesomeIcon icon="right-to-bracket" size={24} color="#124f9f" />}} />
        <Tab.Screen name="Register" component={Register} options={{ title: "Đăng ký", tabBarIcon: () => <FontAwesomeIcon icon="user-plus" size={24} color="#124f9f" />}} />
      </>
      ) : (
      <>
       {user.role === 2 && ( //giảng viên
        <>
          <Tab.Screen name="Lecturer" component={MyStack01} options={{ title: "Hội đồng", tabBarIcon: () => <FontAwesomeIcon icon="rectangle-list" size={24} color="#124f9f" />}} />
        </>
      )}
      {user.role === 1 && ( //sinh viên
        <>
          <Tab.Screen name="Lecturer" component={MyStack04} options={{ title: "Khóa luận", tabBarIcon: () => <FontAwesomeIcon icon="rectangle-list" size={24} color="#124f9f" />}} />
        </>
      )}
      {user.role === 3 && ( //giáo vụ
        <>
          <Tab.Screen name="Thesis" component={MyStack} options={{ title: "Khóa luận", tabBarIcon: () => <FontAwesomeIcon icon="rectangle-list" size={24} color="#124f9f" />}} />
          <Tab.Screen name="Council" component={MyStack03} options={{ title: "Hội đồng", tabBarIcon: () => <FontAwesomeIcon icon="users-rectangle" size={24} color="#124f9f" />}} />
          <Tab.Screen name="AverageScore" component={AverageScore} options={{title: "Thống kê", tabBarIcon: () => <FontAwesomeIcon icon="chart-line" size={24} color="#124f9f" />}} />
        </>
      )}
      <Tab.Screen name="UserProfileAndChangePassword" component={MyStack02} options={{ title: "Profile", tabBarIcon: () => <FontAwesomeIcon icon="user" size={24} color="#124f9f" />}} />
      {/* <Tab.Screen name="UserProfile" component={UserProfile} options={{ title: user.username, tabBarIcon: () => <Icon size={30} color="blue" name="account" />}} /> */}
      </>
      )}
    </Tab.Navigator>
  );
}


export default function App() {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <NavigationContainer>
      <MyUserContext.Provider value={user}>
        <MyDispatcherContext.Provider value={dispatch}>
          <MyTab />
        </MyDispatcherContext.Provider>
      </MyUserContext.Provider>
    </NavigationContainer>
  );
}

