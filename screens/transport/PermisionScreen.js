import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  ActivityIndicator,
  FlatList,
  Alert,
  Button,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import TripItem from '../../components/transport/TripItem';
import * as allInforActions from '../../store/actions/allInfor';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Colors from '../../constaint/Colors';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import database from '@react-native-firebase/database';
import {ScrollView} from 'react-native-gesture-handler';
const PermisionScreen = props => {
  const devices = useSelector(state => state.device.availableDevices);
  const allUsers = useSelector(state => state.user.availableUsers);
  const devices_User = devices.filter(item => item.type === 'UserDevice');
  const devices_Ras = devices.filter(item => item.type === 'RasDevice');
  const curUser = useSelector(state => state.user.currentUser);
  const yourDevice = devices.filter(item => item.ownerUser.id === curUser.id);
  console.log('your device', yourDevice[0]);
  const devices_youCanSee = devices.filter(item => {
    // return curUser.permission.filter(element => element === item.id).length>0? true: false
    return curUser.permission.includes(item.id);
  });
  const arrPermissionOfUser = devices.filter(item =>
    item.waitingPermiss.includes(curUser.id),
  );

  const arrYouHaveGavePermiss = allUsers.filter(item =>
    item.permission.includes(yourDevice[0].id),
  );
  console.log('arr you have gave permiss', allUsers, arrYouHaveGavePermiss);
  const handlerCancelButton = async item => {
    try {
      const response = await fetch(
        `https://clouddhttest.firebaseio.com/Device/${
          item.id
        }/WaitingPermiss/${item.waitingPermiss.findIndex(
          item => item === curUser.id,
        )}.json`,
        {
          method: 'DELETE',
        },
      );
      const resData = await response.json();
      console.log(resData);
    } catch (err) {
      console.log(err);
    }
  };
  const handlerDeleteButtonInItemWaitingPermiss = async element => {
    try {
      console.log(element);
      const response = await fetch(
        `https://clouddhttest.firebaseio.com/Device/${
          yourDevice[0].id
        }/WaitingPermiss/${yourDevice[0].waitingPermiss.findIndex(
          item => item === element,
        )}.json`,
        {
          method: 'DELETE',
        },
      );
      const resData = await response.json();
      console.log('delet ne', resData);
    } catch (err) {
      console.log(err);
    }
  };
  const handlerConfirmButtonInItemWaitingPermiss = async element => {
    try {
      
      console.log(element);
      const response = await fetch(
        `https://clouddhttest.firebaseio.com/User/${
          element
        }/Permision.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([...(allUsers.find(item=> item.id===element)).permission,yourDevice[0].id]),
        },
      );
      const resData = await response.json();
      console.log('put ne', resData);
      handlerDeleteButtonInItemWaitingPermiss(element);
    } catch (err) {
      console.log(err);
    }
  };
  const handlerDeleteButtonInItemYouGivePermiss=(element)=>{
    try {
      
      console.log(element);
      const arrPermissWithUserElement=allUsers.find(item=> item.id===element).permission
      (.splice(yourDevice[0].id);
      const response = await fetch(
        `https://clouddhttest.firebaseio.com/User/${
          element
        }/Permision.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([...(allUsers.find(item=> item.id===element)).permission,yourDevice[0].id]),
        },
      );
      const resData = await response.json();
      console.log('put ne', resData);
      handlerDeleteButtonInItemWaitingPermiss(element);
    } catch (err) {
      console.log(err);
    }


  }
  const itemWaitingPermission = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <View style={{width: '30%'}}>
          <Text style={{fontSize: 18, marginLeft: 20}}>{item.name}</Text>
        </View>
        <View style={{width: '70%', alignItems: 'flex-end'}}>
          <View style={{width: '50%'}}>
            <Button
              color={Colors.primary}
              title="Hủy"
              onPress={() => handlerCancelButton(item)}
            />
          </View>
        </View>
      </View>
    );
  };

  const itemYouGivePermission = ({item, index}) => {
    return (
      item && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flex: 1,
          }}>
          <View style={{width: '40%'}}>
            <Text style={{fontSize: 18, marginLeft: 20}}>{item}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '65%',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                width: '45%',
              }}>
              <Button
                color={Colors.primary}
                title="Cấp quyền"
                onPress={() => handlerConfirmButtonInItemWaitingPermiss(item)}
              />
            </View>
            <View
              style={{
                width: '45%',
              }}>
              <Button
                color="orange"
                title="Xóa"
                onPress={() => handlerDeleteButtonInItemWaitingPermiss(item)}
              />
            </View>
          </View>
        </View>
      )
    );
  };

  const itemYouHaveGavePermiss = ({item, index}) => {
    return (
      item && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            flex: 1,
          }}>
          <View style={{width: '50%'}}>
            <Text style={{fontSize: 18, marginLeft: 20}}>{item.id}</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '70%',
              justifyContent: 'space-around',
            }}>
            <View
              style={{
                width: '45%',
              }}>
              <Button
                color="orange"
                title="Xóa"
                onPress={() => handlerCancelButton(item)}
              />
            </View>
          </View>
        </View>
      )
    );
  };
  console.log(arrPermissionOfUser);
  return (
    <ScrollView>
      <View style={{padding: 20}}>
        <View
          style={{
            paddingTop: 20,
            borderWidth: 1,
            borderColor: '#ddd',
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginHorizontal: 20,
                marginBottom: 20,
                textAlign: 'center',
              }}>
              Chờ User khác cấp quyền truy cập vị trí cho bạn trên thiết bị
            </Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingTop: 10}}>
            <FlatList
              data={arrPermissionOfUser}
              renderItem={itemWaitingPermission}
            />
          </View>
        </View>

        <View
          style={{
            paddingTop: 20,
            borderWidth: 1,
            borderColor: '#ddd',
            marginTop: 30,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginHorizontal: 20,
                marginBottom: 20,
                textAlign: 'center',
              }}>
              Cấp quyền truy cập vị trí cho User khác
            </Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingTop: 10}}>
            <FlatList
              keyExtractor={(item, index) => index.toString()}
              data={yourDevice[0].waitingPermiss}
              renderItem={itemYouGivePermission}
            />
          </View>
        </View>
        <View
          style={{
            paddingTop: 20,
            borderWidth: 1,
            borderColor: '#ddd',
            marginTop: 20,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#ddd',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                marginHorizontal: 20,
                marginBottom: 20,
                textAlign: 'center',
              }}>
              Các User bạn đã cấp quyền truy cập vị trí
            </Text>
          </View>
          <View style={{paddingHorizontal: 10, paddingTop: 10}}>
            <FlatList
              data={arrYouHaveGavePermiss}
              renderItem={itemYouHaveGavePermiss}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default PermisionScreen;
