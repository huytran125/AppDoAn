import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Button,
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import TripItem from '../../components/transport/TripItem';
import * as allInforActions from '../../store/actions/allInfor';
import {
  HeaderButton,
  Item,
  HeaderButtons,
} from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Colors from '../../constaint/Colors';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import database from '@react-native-firebase/database';

const DeviceOverViewScreen = props => {
  const devices = useSelector(state => state.device.availableDevices);
  const devices_User = devices.filter(item => item.type === 'UserDevice');
  const devices_Ras = devices.filter(item => item.type === 'RasDevice');
  const curUser = useSelector(state => state.user.currentUser);
  const yourDevice = devices.filter(item => item.ownerUser.id === curUser.id);
  const devices_youCanSee = devices.filter(item => {
    // return curUser.permission.filter(element => element === item.id).length>0? true: false
    return curUser.permission.includes(item.id);
  });

  const [isErr, setIsErr] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const onChangeScreen = pickDevice => {
    props.navigation.navigate('VehicleLocationScreen', {
      pickDevice: pickDevice,
    });
  };
  const FirstRoute = () => (
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        style={{width: '90%'}}
        numColumns={2}
        onEndReachedThreshold={0.2}
        data={devices_User}
        renderItem={itemData => (
          <TripItem
            title={itemData.item.name}
            onSelect={() => {
              onChangeScreen(itemData.item.id);
            }}
          />
        )}
      />
    </View>
  );

  const SecondRoute = () => (
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <FlatList
        style={{width: '90%'}}
        numColumns={2}
        onEndReachedThreshold={0.2}
        data={devices_Ras}
        renderItem={itemData => (
          <TripItem
            title={itemData.item.name}
            onSelect={() => {
              onChangeScreen();
            }}
          />
        )}
      />
    </View>
  );
  const ThridRoute = () => (
    <View style={{width: '100%'}}>
      <View>
        <Text style={{textAlign: 'center', fontSize: 20}}>
          Thiết bị của bạn
        </Text>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            style={{width: '90%'}}
            numColumns={2}
            onEndReachedThreshold={0.2}
            data={yourDevice}
            renderItem={itemData => <TripItem title={itemData.item.name} />}
          />
        </View>
      </View>
      <View>
        <Text style={{textAlign: 'center', fontSize: 20}}>
          Thiết bị người khác
        </Text>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <FlatList
            style={{width: '90%'}}
            numColumns={2}
            onEndReachedThreshold={0.2}
            data={devices_youCanSee}
            renderItem={itemData => <TripItem title={itemData.item.name} />}
          />
        </View>
      </View>
    </View>
  );

  const [index, setIndex] = useState(0);

  const [routes, setRoutes] = useState([
    {key: 'first', title: 'Thiết bị người dùng chưa được xem'},
    {key: 'second', title: 'Thiết bị Ras chưa được xem'},
    {key: 'thrid', title: 'Thiết bị có thể xem'},
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    thrid: ThridRoute,
  });
  const _renderItem = ({item}) => {
    return 0;
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: 'white'}}
      style={{
        backgroundColor: Colors.primary,
        borderTopColor: 'black',
        borderTopWidth: 1,
      }}
    />
  );

  React.useLayoutEffect(() => {
    props.navigation.setOptions({
      headerTitle: 'Chọn tuyến đường',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Menu"
            iconName="ios-menu"
            onPress={() => props.navigation.toggleDrawer()}
          />
        </HeaderButtons>
      ),

      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Cart"
            iconName="ios-cart"
            onPress={() => props.navigation.navigate('CartScreen')}
          />
        </HeaderButtons>
      ),
    });
  }, [props.navigation]);
  const loadDevice = useCallback(async () => {
    setIsErr(null);
    try {
      await dispatch(allInforActions.fetchAllInfor());
    } catch (err) {
      setIsErr(err.message);
    }
  }, [dispatch, setIsErr, setIsLoading]);
  useEffect(() => {
    database()
      .ref('/Device')
      .on('value', snapshot => {
        dispatch(allInforActions.fetchAllInfor());
      });
    database()
      .ref('/User')
      .on('value', snapshot => {
        dispatch(allInforActions.fetchAllInfor());
      });
    setIsLoading(true);
    loadDevice().then(() => setIsLoading(false));
  }, [dispatch, loadDevice]);

  if (isErr) {
    return (
      <View style={styles.centered}>
        <Text>An error occurred!</Text>
        <Button title="Try again" color={Colors.primary} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && devices.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No trip found. Maybe start adding some!</Text>
      </View>
    );
  }
  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: Dimensions.get('window').width}}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
export default DeviceOverViewScreen;
