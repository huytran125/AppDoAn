import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, ActivityIndicator, AsyncStorage } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import TripItem from '../../components/transport/TripItem';
import * as allInforActions from '../../store/actions/allInfor';
import { HeaderButton, Item, HeaderButtons } from 'react-navigation-header-buttons';
import CustomHeaderButton from '../../components/UI/CustomHeaderButton';
import Colors from '../../constaint/Colors'



const TripOverViewScreen = props => {
    const trips = useSelector(state => state.trips.availableTrips);
    const [isErr, setIsErr] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerTitle: 'Chọn tuyến đường',
            headerLeft: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item title="Menu" iconName="ios-menu" onPress={() => props.navigation.toggleDrawer()} />
            </HeaderButtons>),

            headerRight: () => (<HeaderButtons HeaderButtonComponent={CustomHeaderButton} >
                <Item title="Cart" iconName="ios-cart" onPress={() => props.navigation.navigate('CartScreen')} />
            </HeaderButtons>)


        });
    }, [props.navigation]);
    const loadTrip = useCallback(async () => {
        setIsErr(null);
        try {
            await dispatch(allInforActions.fetchAllInfor());

        } catch (err) {

            setIsErr(err.message);
        }
    }, [dispatch, setIsErr, setIsLoading]);
    useEffect(() => {
        setIsLoading(true);

        loadTrip().then(() => setIsLoading(false));



    }, [dispatch, loadTrip]);

    if (isErr) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadTrip}
                    color={Colors.primary}
                />
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

    if (!isLoading && trips.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No trip found. Maybe start adding some!</Text>
            </View>
        );
    }
    return (

        <View>
            <FlatList data={trips} renderItem={itemData => <TripItem
                title={itemData.item.title}
                price={itemData.item.price.toFixed(2)}
                image={itemData.item.imageUrl}
                onSelect={() => props.navigation.navigate('TripDetailScreen', { tripId: itemData.item.id })}

            >
            </TripItem>} />

        </View>
    );
}

const styles = StyleSheet.create({
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' }

});
export default TripOverViewScreen;

