


import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapView, { Marker, AnimatedRegion, Animated } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { HeaderButton, Item, HeaderButtons } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import { StyleSheet, Text, View, Dimensions, Image, TouchableNativeFeedback, Button, Keyboard } from 'react-native';
import Card from '../../components/UI/Card';
import Constants from 'expo-constants';
import * as Locate from 'expo-location';
import Address from '../../models/address';
import Location from '../../models/location';
import Delta from '../../models/delta';
import Colors from '../../constaint/Colors';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from 'react-native-geocoding';
import { Ionicons, MaterialIcons, AntDesign, FontAwesome, Entypo } from '@expo/vector-icons';
const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } } };
const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } } };


const API_KEY = 'AIzaSyBx4uLIYK_uzjH3cMWq1LJk9YvMLEVj0Pc';
Geocoder.init(API_KEY); // use a valid API key

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const TripMapScreen = props => {
    const [curLocate, setCurLocate] = useState(false);
    const [changeMarker, setChangeMarker] = useState(false);
    const map = useRef(null);
    const tripId = props.route.params.tripId;
    const tripItem = useSelector(state => state.trips.availableTrips.find(item => item.id === tripId));
    const destinationPlace = props.route.params.destinationPlace;
    const locationTrip = tripItem[destinationPlace ? "place1" : "place2"].address;
    const [showSearchLocation, setShowSearchLocation] = useState(false);
    const [pickUpLocation, setPickUpLocation] = useState({
        fullLocationTrip: locationTrip,
        delta: new Delta(LATITUDE_DELTA, LONGITUDE_DELTA),
    });
    const [coor, setCoor] = useState(new AnimatedRegion({
        latitude: locationTrip.location.lat,
        longitude: locationTrip.location.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    }))
    const [errorMsg, setErrorMsg] = useState(null);

    const fetchAddress = async (region) => {
        let resAddressData;
        let addressData;
        try {
            resAddressData = await Geocoder.from(region.latitude, region.longitude);
            addressData = resAddressData.results[0].address_components.reduce(((previous, current) => previous + current.long_name + ', '), '')

        } catch (err) {
            addressData = null
        }

        setPickUpLocation(
            {
                fullLocationTrip: new Address(null, addressData, new Location(region.latitude, region.longitude)),
                delta: new Delta(region.latitudeDelta, region.longitudeDelta),
            }
        )

    }
    console.log(pickUpLocation)
    const showSearchLocationHandler = () => {
        setShowSearchLocation(previous => !previous);
    }
    const backButtonHandler = () => {
        Keyboard.dismiss();
        setShowSearchLocation(previous => !previous);


    }
    const onDragEndHandler = e => {
        e.persist();
        setPickUpLocation(previous => {
            return {
                fullLocationTrip: new Address(null, null, new Location(e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude)),
                delta: new Delta(previous.delta.latitudeDelta, previous.delta.longitudeDelta),
            }
        }


        );

    }
    const onRegionChangeHandler = (region) => {
        console.log('this is coor');
        console.log(coor);
        const newCoordinate = {
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta
        };


        coor.timing(newCoordinate).start();

    }
    const onRegionChangeCompleteHandler = region => {

        fetchAddress(region);


    }
    const fetchCurrentLocation = () => {
        const getLocation = async () => {
            try {
                let { status } = await Locate.requestPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                }


                console.log('this useeffect');


                let location = await Locate.getCurrentPositionAsync({});
                setCoor(new AnimatedRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }))
                await fetchAddress({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA

                })
                setTimeout(() => setCurLocate(true), 1000);
                ;
            } catch (err) {
                return;
            }
        };

        getLocation();

    }

    const googleAutoCompleteHandler = (data, details = null) => { // 'details' is provided when fetchDetails = true
        setShowSearchLocation(false);
        setCurLocate(false);
        setCoor(new AnimatedRegion({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        }))
        setPickUpLocation(
            {
                fullLocationTrip: new Address(null, details.formatted_address, new Location(details.geometry.location.lat, details.geometry.location.lng)),
                delta: new Delta(LATITUDE_DELTA, LONGITUDE_DELTA),
            }
        )


        setTimeout(() => setCurLocate(true), 2000);
    }
    const onMyLocationHandler = () => {
        fetchCurrentLocation();
    }
    useEffect(() => {
        fetchCurrentLocation();


    }, []);
    React.useLayoutEffect(() => {
        console.log(showSearchLocation);
        props.navigation.setOptions({
            headerTitle: 'Tìm kiếm địa chỉ',
            headerLeft: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item title="Left" onPress={backButtonHandler} iconType={AntDesign} iconName="arrowleft" />
            </HeaderButtons>),

            headerShown: showSearchLocation

        })
    }, [props.navigation, showSearchLocation, showSearchLocationHandler]);
    return (
        <View style={styles.screen}>
            {
                !showSearchLocation && <Card style={styles.mapContainer} >
                    <MapView
                        ref={map}
                        style={StyleSheet.absoluteFill}
                        maxZoomLevel={19}
                        rotateEnabled={false}
                        region={{
                            latitude: pickUpLocation.fullLocationTrip.location.lat,
                            longitude: pickUpLocation.fullLocationTrip.location.lng,
                            latitudeDelta: pickUpLocation.delta.latitudeDelta,
                            longitudeDelta: pickUpLocation.delta.longitudeDelta,

                        }}


                        showsUserLocation={true}
                        zoomControlEnabled={true}
                        onRegionChange={onRegionChangeHandler}
                        onRegionChangeComplete={curLocate ? onRegionChangeCompleteHandler : () => { }}


                    >

                        <MapView.Marker.Animated draggable
                            coordinate={coor}
                            onDragEnd={onDragEndHandler}
                        >
                            <MaterialIcons name="flag" size={50} color={Colors.primary} />
                        </MapView.Marker.Animated>

                    </MapView>

                    <View style={styles.myLocationIcon} >
                        <MaterialIcons onPress={onMyLocationHandler} name="my-location" size={35} color={Colors.primary} />
                    </View>

                    <TouchableNativeFeedback  >
                        <View style={styles.backInMapIcon} >
                            <Ionicons name="ios-arrow-round-back" size={35} color='white' />
                        </View>
                    </TouchableNativeFeedback>
                    <Text>{pickUpLocation.fullLocationTrip.location.lat}</Text>
                    <Text>{pickUpLocation.fullLocationTrip.location.lng}</Text>
                    <Text>{curLocate ? 'true' : 'false'}</Text>

                </Card>
            }
            {
                !showSearchLocation && <Card style={styles.selectLocationContainer}>
                    <Text style={styles.normalTextInput} >
                        Chọn nơi đón
                    </Text>
                    <View style={styles.iconWithTextSelectLocation}>
                        <Entypo name="location" size={30} color={Colors.primary} />
                        <TouchableNativeFeedback onPress={showSearchLocationHandler} >
                            <View style={styles.normalTextInputContainer} >
                                <Text style={styles.normalTextInput} >
                                    {pickUpLocation.fullLocationTrip.formattedAdress}
                                </Text>
                            </View>
                        </TouchableNativeFeedback>
                        <View style={styles.buttonContainer} >
                            <Button height={40} color={Colors.primary} title="Đặt xe" style={styles.normalTextInput} />

                        </View>
                    </View>

                    <View>

                    </View>
                </Card>
            }
            {
                showSearchLocation && <View style={styles.searchWithTextContainer}>
                    <Card style={styles.searchContainer}>

                        <GooglePlacesAutocomplete
                            placeholder='Enter Location'
                            minLength={2}
                            autoFocus={false}
                            returnKeyType={'default'}
                            fetchDetails={true}
                            onPress={googleAutoCompleteHandler}
                            query={{
                                // available options: https://developers.google.com/places/web-service/autocomplete
                                key: API_KEY,
                                language: 'vi', // language of the results
                                // types: 'address' // default: 'geocode'
                            }}
                            styles={{

                                textInputContainer: {
                                    backgroundColor: 'rgba(0,0,0,0)',
                                    borderTopWidth: 0,
                                    borderBottomWidth: 0
                                },
                                textInput: {
                                    marginLeft: 20,
                                    marginRight: 0,
                                    height: 38,
                                    color: '#5d5d5d',
                                    fontSize: 18
                                },
                                predefinedPlacesDescription: {
                                    color: '#1faadb'
                                },

                            }}

                            currentLocation={false}
                            renderLeftButton={() =>
                                <View style={styles.iconSearchContainer}>
                                    <Entypo name="location" size={30} color={Colors.primary} />
                                </View>}

                        />


                    </Card>
                </View>

            }
        </View>

    );

    /*
        return (
    
    
            <MapView
                style={StyleSheet.absoluteFill}
                initialRegion={{
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}   >
                <MapViewDirections
                    origin={{
                        latitude: 37.3317876,
                        longitude: -122.0054812
                    }}
                    destination={{
                        latitude: 37.771707,
                        longitude: -122.4053769,
                    }}
                    apikey={API_KEY}
                    strokeWidth={3}
                    strokeColor="hotpink"
                />
            </MapView>
    
    
    
        );
        */
}



const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    mapContainer: {
        height: '75%',
        padding: 50,

    },
    map: {
        flex: 1
    },
    selectLocationContainer: {
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        height: '25%',
        padding: 20,
        marginTop: 20
    },
    searchWithTextContainer: {
        flex: 1,
        paddingTop: 30
    },
    searchContainer: {

        borderRadius: 10,
        height: '80%',
        padding: 20,


    },

    mapStyle: {
        width: '100%',
        height: '100%',
    },

    iconSearchContainer: {
        marginTop: 10,
    },
    iconWithTextSelectLocation: {
        marginVertical: 10,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    normalTextInputContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        width: '45%',
        padding: 5

    },

    normalTextInput: {
        fontFamily: 'oswald-regular',
        fontSize: 20,


    },
    myLocationIcon: {
        position: "absolute",
        bottom: 80,
        right: 20,
    },
    backInMapIcon: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 10,
        position: "absolute",
        top: 30,

    }


})


export default TripMapScreen;



