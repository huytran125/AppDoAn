import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, AsyncStorage, ScrollView, TouchableNativeFeedback, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButton, Item, HeaderButtons } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Colors from '../../constaint/Colors';
import Card from '../../components/UI/Card';
import Trip from '../../models/trip';
import { Ionicons, MaterialIcons, AntDesign, FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as dateConstraint from '../../constaint/DatesConstraint';



const TripDetailScreen = props => {

    const tripId = props.route.params.tripId;
    const [destination, setDestination] = useState(true);
    const [dateToMove, setDateToMove] = useState(dateConstraint.Dates.currentDate);
    const [timeToMove, setTimeToMove] = useState(null);
    console.log('this is trip detail');
    console.log(arrFrom);
    const [showDate, setShowDate] = useState(false);
    const tripItem = useSelector(state => state.trips.availableTrips.find(item => item.id === tripId));
    const arrFrom = destination ? tripItem.fromSG : tripItem.fromPT;
    console.log(showDate);
    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Chọn tuyến đường',
            headerRight: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item title="Cart" iconName="ios-cart" onPress={() => props.navigation.navigate('TripMapScreen', { destinationPlace: destination, tripId: tripId })} />
            </HeaderButtons>)


        });
    }, [props.navigation]);


    const onDateHandler = useCallback(
        (event, selectedDate) => {
            setShowDate(previousState => !previousState);

            setDateToMove(selectedDate || dateToMove);




        }, [setShowDate, setDateToMove])
    const onShowModelHandler = () => {
        setShowDate(true);



    }
    const onTimeHandler = (time) => {
        setTimeToMove(time);

    }
    const mapWithTimeItem = (arrFrom, type) => {
        return arrFrom.filter((item, index) => {
            return (index % 2) === (type ? 0 : 1)
        }).map(item => {
            const changeStyleItem = timeToMove === item.Time.time
            return (
                <TouchableNativeFeedback key={item.Time.id} onPress={() => onTimeHandler(item.Time.time)} >

                    <View style={{ ...styles.iconWithTimeContainer, backgroundColor: changeStyleItem ? Colors.primary : 'white' }}>
                        <AntDesign name="clockcircle" size={30} color={changeStyleItem ? 'white' : Colors.primary} />

                        <View style={styles.normalTextContainer} >
                            <Text style={{ ...styles.normalText, color: changeStyleItem ? 'white' : 'black' }} >
                                {item.Time.time}
                            </Text>
                        </View>
                    </View>
                </TouchableNativeFeedback>

            )
        })


    }
    return (
        <ScrollView style={styles.scrollView}>
            <Card style={styles.fromToContainer}>

                <Text style={styles.title}>Điểm khởi hành</Text>

                <View style={styles.iconWithTextContainer}>
                    <MaterialIcons name="location-city" size={35} color={Colors.primary} />
                    <Text style={styles.normalText}>{destination ? tripItem.place1.name : tripItem.place2.name}</Text>
                </View>
                <View style={styles.switchIconContainer}>
                    <TouchableNativeFeedback onPress={() => setDestination(previousState => !previousState)}>
                        <View>
                            <MaterialIcons name="swap-vert" size={40} color={Colors.primary} />

                        </View>

                    </TouchableNativeFeedback>

                </View>
                <Text style={styles.title}>Điểm đến</Text>
                <View style={styles.iconWithTextContainer}>
                    <MaterialIcons name="location-city" size={35} color={Colors.primary} />
                    <Text style={styles.normalText}>{destination ? tripItem.place2.name : tripItem.place1.name}</Text>
                </View>


            </Card>


            <Card style={styles.dateContainer}>
                <Text style={styles.title}>Ngày khởi hành </Text>

                <View style={styles.iconWithTextContainer}>
                    <AntDesign name="calendar" size={40} color={Colors.primary} />

                    <TouchableNativeFeedback onPress={onShowModelHandler} >
                        <View style={styles.normalTextInputContainer} >
                            <Text style={styles.normalTextInput} >
                                {dateConstraint.changeDateToVietnamStringFormat(dateToMove)}
                            </Text>
                        </View>
                    </TouchableNativeFeedback>
                </View>
            </Card>
            <Card style={styles.timeContainer}>
                <Text style={styles.title}>Chọn thời gian khởi hành</Text>
                <View style={styles.twoTimeColumnContainer} >

                    <View style={styles.timeColumnContainer}>
                        {


                            mapWithTimeItem(arrFrom, true)
                        }
                    </View>
                    <View style={{ ...styles.timeColumnContainer, marginLeft: 10 }}>
                        {


                            mapWithTimeItem(arrFrom, false)
                        }
                    </View>






                </View>

            </Card>
            {
                showDate && <DateTimePicker
                    locale='vie'
                    style={{ width: 200 }}
                    value={dateToMove}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minimumDate={dateConstraint.Dates.currentDate}
                    maximumDate={dateConstraint.Dates.maxDate}
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    onChange={onDateHandler}
                    textColor={Colors.primary}


                />


            }
        </ScrollView>
    )
}



const styles = StyleSheet.create({
    dateContainer: {
        height: 140,
        padding: 20,
        marginTop: 20

    },
    fromToContainer: {
        height: 260,
        width: '100%',
        padding: 20,
        marginTop: 10
    },
    timeContainer: {

        width: '100%',
        padding: 20,
        marginTop: 20,


    },
    twoTimeColumnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',


    },
    timeColumnContainer: {
        width: '50%',


    },
    scrollView: {
        padding: 20,
    },
    iconWithTextContainer: {
        marginVertical: 10,

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    iconWithTimeContainer: {
        marginVertical: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        borderColor: '#ccc',
        borderWidth: 1,


    },
    title: {
        fontFamily: 'oswald-semi-bold',
        fontSize: 22
    },
    normalText: {
        fontFamily: 'oswald-regular',
        fontSize: 22,
        marginLeft: 30,

    },
    normalTextInputContainer: {
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: "center",
        justifyContent: 'center',
        marginLeft: 30,
        padding: 10,

    },

    normalTextInput: {
        fontFamily: 'oswald-regular',
        fontSize: 18,


    },
    switchIconContainer: {
        alignItems: 'center',

    }

})
export default TripDetailScreen;