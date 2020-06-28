import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Dimensions, Alert, Picker} from 'react-native';
import Card from '../../components/UI/Card';
import {useSelector, useDispatch} from 'react-redux';
import MapView, {Marker, AnimatedRegion, Animated} from 'react-native-maps';
import Colors from '../../constaint/Colors';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import database from '@react-native-firebase/database';
import {TouchableNativeFeedback} from 'react-native-gesture-handler';
import * as allInforActions from '../../store/actions/allInfor';

const API_KEY = 'AIzaSyBx4uLIYK_uzjH3cMWq1LJk9YvMLEVj0Pc';
Geocoder.init(API_KEY); // use a valid API key
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Infornormalvehicle = props => {
  const dispatch = useDispatch();

  const devices = useSelector(state => state.device.availableDevices);
  const curUser = useSelector(state => state.user.currentUser);
  const yourDevice = devices.find(item => item.ownerUser.id === curUser.id);
  const devices_youCanSee = devices.filter(item => {
    // return curUser.permission.filter(element => element === item.id).length>0? true: false
    return curUser.permission.includes(item.id);
  });
  const choosenDevice = devices_youCanSee.find(
    item => item.id === props.choosenDevice.deviceToShow,
  );
  const indexToDelete = devices_youCanSee.findIndex(
    item => item.id === props.choosenDevice.deviceToShow,
  );
  devices_youCanSee.splice(indexToDelete, 1);
  const [selectedValue, setSelectedValue] = useState(devices_youCanSee[0].id);
  const [currentDistanceDevice, setCurrentDistanceDevice] = useState(
    devices_youCanSee[0],
  );
  const [currentDistance, setCurrentDistance] = useState(0);
  const [vehicleLocation, setVehicleLocation] = useState(yourDevice.location);
  const isFocus = useIsFocused();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [addressData, setAddressData] = useState('');
  const [currentDistanceWay, setCurrentDistanceWay] = useState(0);
  const [yourCurentLocation, setYourCurrentLocation] = useState({
    latitude: choosenDevice.location.lat,
    longitude: choosenDevice.location.lng,
    speed: 1,
  });

  /*
    const [vehicleChange, setVehicleChange] = useState(new AnimatedRegion({
        latitude: selectedVehicle.location.lat,
        longitude: selectedVehicle.location.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    }))
    */
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
    fetchAddress({
      latitude: choosenDevice.location.lat,
      longitude: choosenDevice.location.lng,
    });
    setCurrentDistanceDevice(devices_youCanSee[0]);
    fetchDataDevice();
    return function cleanup() {
      setAddressData('');
      setCurrentDistance(0);
      setCurrentDistanceWay(0);
    };
  }, [
    choosenDevice.location.lng,
    choosenDevice.location.lat,
    currentDistanceDevice.location.lat,
    currentDistanceDevice.location.lng,
  ]);
  /* React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            const getFromServer = setInterval((async () => {
                {
                    data = await fetch(`https://clouddhttest.firebaseio.com/Vehicle/${selectedVehicle.id}/Location.json`).then(data => data.json());

                    console.log(data);
                    const newCoordinate = {
                        latitude: data.lat,
                        longitude: data.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    };


                    vehicleChange.timing(newCoordinate).start();

                }



            }), 1000)



            // The screen is focused
            // Call any action
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props.navigation]);
    */
  const fetchDistance = async (region1, region2) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${
          region1.latitude
        },${region1.longitude}&destination=${region2.latitude},${
          region2.longitude
        }&sensor=false&key=AIzaSyBx4uLIYK_uzjH3cMWq1LJk9YvMLEVj0Pc`,
        {
          method: 'GET',
        },
      );
      const data = await response.json();

      setCurrentDistanceWay(data.routes[0].legs[0].distance.value);
    } catch (err) {
      setCurrentDistanceWay(0);
    }
  };
  const fetchDataDevice = () => {
    /* const response = await fetch(
      `https://clouddhttest.firebaseio.com/Device/${selectedValue}.json?`,
      {
        method: 'GET',
      },
    );
    const data = await response.json();
    console.log('data response', data);
    */
    console.log('curent device', currentDistanceDevice);
    fetchDistance(
      {
        latitude: currentDistanceDevice.location.lat,
        longitude: currentDistanceDevice.location.lng,
      },
      {
        latitude: choosenDevice.location.lat,
        longitude: choosenDevice.location.lng,
      },
    );

    setCurrentDistance(
      calculateSpeed(
        1,
        currentDistanceDevice.location.lat,
        currentDistanceDevice.location.lng,
        2,
        choosenDevice.location.lat,
        choosenDevice.location.lng,
      ),
    );
  };
  const fetchAddress = async region => {
    let resAddressData;

    try {
      resAddressData = await Geocoder.from(region.latitude, region.longitude);
      setAddressData(
        resAddressData.results[0].address_components.reduce(
          (previous, current) => previous + current.long_name + ', ',
          '',
        ),
      );
    } catch (err) {
      addressData = null;
    }
  };
  const toRad = number => {
    return (number * Math.PI) / 180;
  };

  function calculateSpeed(t1, lat1, lon1, t2, lat2, lon2, unit = 'N') {
    // From Caspar Kleijne's answer starts
    /** Converts numeric degrees to radians */

    // From Caspar Kleijne's answer ends
    // From cletus' answer starts
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }

  function firstGeolocationSuccess(position1, position2) {
    var t1 = Date.now();

    const speed = calculateSpeed(
      2,
      position1.lat,
      position1.lng,
      4,
      position2.lat,
      position2.lng,
    );
    return speed;
  }

  /*
    useEffect(() => {

        const getFromServer = setInterval((async () => {
            {
                !isFocus ? clearInterval(getFromServer)
                    : data = await fetch(`https://clouddhttest.firebaseio.com/Vehicle/${selectedVehicle.id}/Location.json`).then(data => data.json());

                console.log(data);
                const newCoordinate = {
                    latitude: data.lat,
                    longitude: data.lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                };
                console.log(isFocus);

                speedVehicle = firstGeolocationSuccess(
                    {
                        lat: 51.5,
                        lng: 0
                    },
                    {
                        lat: 51.5,
                        lng: 0

                    }
                )
                console.log(speedVehicle);
                vehicleChange.timing(newCoordinate).start();

            }




        }), 1000)



        return () => {
            clearInterval(getFromServer);
        }


            ;




    })
*/
  return (
    <View style={styles.screen}>
      <View
        style={{
          width: '100%',
          borderColor: '#ddd',
          borderBottomWidth: 1,
          height: '10%',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Text style={{fontWeight: 'bold'}}>Device: {choosenDevice.name}</Text>
        <Text style={{fontWeight: 'bold'}}>
          Username: {choosenDevice.ownerUser.name}
        </Text>
      </View>
      <View style={{width: '100%', height: '30%'}}>
        <View style={{paddingLeft: 20, paddingTop: 10, height: '50%'}}>
          <Text>
            <Text style={{fontWeight: 'bold'}}>Địa chỉ: </Text>
            {addressData}
          </Text>
        </View>
        <View style={{paddingLeft: 20, marginTop: 20, height: '60%'}}>
          <Text>
            <Text style={{fontWeight: 'bold'}}>Tọa độ: </Text>
            {choosenDevice.location.lat} và {choosenDevice.location.lng}
          </Text>
        </View>
      </View>
      <View
        style={{width: '100%', height: '10%', marginTop: 10, paddingLeft: 20}}>
        <Text style={{fontWeight: 'bold'}}>Khoảng cách:</Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              paddingTop: 4,
              marginTop: 5,
              paddingHorizontal: 2,
            }}>
            <Text style={{fontSize: 16}}> {choosenDevice.name}</Text>
          </View>
          <View
            style={{
              borderWidth: 1,
              borderColor: '#ddd',
              padding: 2,
              marginTop: 5,
            }}>
            <Picker
              selectedValue={selectedValue}
              style={{height: 30, width: 150, fontSize: 14}}
              onValueChange={(itemValue, itemIndex) => {
                setCurrentDistanceDevice(
                  devices.find(item => item.id === itemValue),
                );
                setSelectedValue(itemValue);
              }}>
              {devices_youCanSee.map((item, index) => {
                return <Picker.Item label={item.name} value={item.id} />;
              })}
            </Picker>
          </View>

          <View />
        </View>
        <View
          style={{
            padding: 2,
            marginTop: 8,
          }}>
          <Text>Theo đường chim bay la: {currentDistance.toFixed(4)} km</Text>
          <Text style={{marginTop: 10}}>
            Theo tuyến đường ngắn nhất:{' '}
            {currentDistanceWay > 0
              ? (currentDistanceWay / 1000).toFixed(4) + ' km'
              : 'không tìm được khoảng cách'}
          </Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    paddingTop: 15,
    flex: 1,
    justifyContent: 'flex-start',
    height: '100%',
  },
});
export default Infornormalvehicle;
