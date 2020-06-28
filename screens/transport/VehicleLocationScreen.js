import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Dimensions, Alert} from 'react-native';
import Card from '../../components/UI/Card';
import {useSelector, useDispatch} from 'react-redux';
import MapView, {Marker, AnimatedRegion, Animated} from 'react-native-maps';
import Colors from '../../constaint/Colors';
import {useIsFocused} from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import database from '@react-native-firebase/database';
import Infovehicle from '../transport/Inforvehicle';
import Infornormalvehicle from '../transport/Infornormalvehicle';
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const VehicleLocationScreen = props => {
  const prevCountRef = useRef();

  const devices = useSelector(state => state.device.availableDevices);
  const curUser = useSelector(state => state.user.currentUser);
  const yourDevice = devices.find(item => item.ownerUser.id === curUser.id);
  const devices_youCanSee = devices.filter(item => {
    // return curUser.permission.filter(element => element === item.id).length>0? true: false
    return curUser.permission.includes(item.id);
  });

  const [showCurrentDevice, setShowCurrentDevice] = useState(true);
  const [deviceToShow, setDeviceToShow] = useState(null);
  const isFocus = useIsFocused();
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [yourCurentLocation, setYourCurrentLocation] = useState({
    latitude: yourDevice.location.lat,
    longitude: yourDevice.location.lng,
    speed: 1,
  });

  const [coor, setCoor] = useState(
    new AnimatedRegion({
      latitude: yourDevice.location.lat,
      longitude: yourDevice.location.lat,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  );
  const arrAnimatedDeviceYouCanSee = devices_youCanSee.map(item => {
    return {
      location: new AnimatedRegion({
        latitude: item.location.lat,
        longitude: item.location.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      }),
      device: item,
    };
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
    const mytimer = setInterval(
      () =>
        Geolocation.getCurrentPosition(
          position => {
            database()
              .ref(`/Device/${yourDevice.id}/Location`)
              .set({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              })
              .then();
            /* setYourCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.latitude,
              
            });
            */
            const newCoordinate = {
              latitude:
                position.coords.latitude +
                (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
              longitude:
                position.coords.longitude +
                (Math.random() - 0.5) * (LATITUDE_DELTA / 2),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            };
            coor.timing(newCoordinate).start();
          },
          error => Alert.alert('Kết nối mạng không ổn định'),
          {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
        ),
      1000,
    );
    return function cleanup() {
      clearInterval(mytimer);
    };
  }, []);
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
      return dist * 3600;
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
  const onPressMarkersHandler = item => {
    console.log('marker handler', item);
    setDeviceToShow(item.device.id);
    setShowCurrentDevice(false);
  };
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
      <Card style={styles.mapContainer}>
        <MapView
          style={StyleSheet.absoluteFill}
          maxZoomLevel={20}
          rotateEnabled={false}
          initialRegion={{
            latitude: yourCurentLocation.latitude,
            longitude: yourCurentLocation.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
          showsUserLocation={true}
          zoomControlEnabled={true}>
          <Marker.Animated
            coordinate={coor}
            onPress={() => {
              setShowCurrentDevice(true);
            }}
          />
          {arrAnimatedDeviceYouCanSee.map(item => {
            return (
              <Marker.Animated
                coordinate={item.location}
                onPress={() => {
                  onPressMarkersHandler(item);
                }}
              />
            );
          })}
        </MapView>
      </Card>
      <Card style={styles.detailsContainer}>
        {showCurrentDevice && <Infovehicle />}
        {!showCurrentDevice && (
          <Infornormalvehicle choosenDevice={{deviceToShow}} />
        )}
      </Card>
    </View>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: '60%',
    padding: 50,
    width: '100%',
  },
  detailsContainer: {
    bottom: 0,
    right: 0,

    height: '40%',

    width: '100%',
  },
});
export default VehicleLocationScreen;
