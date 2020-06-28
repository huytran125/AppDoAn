import React from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, TouchableNativeFeedback, ImageBackground } from 'react-native';
import Colors from '../../constaint/Colors';
import Card from '../../components/UI/Card';

const TripItem = props => {
    return (
        <View style={styles.touchable}>
            <View>
                
                    <TouchableNativeFeedback useForeground onPress={props.onSelect}>
                        <View>
                            


                                <View style={styles.blurContainerDetail}>
                                    <View style={styles.details}>
                                        <Text style={styles.title}>{props.title.toUpperCase()}</Text>

                                    </View>


                                </View>


              
                        </View>
                    </TouchableNativeFeedback>


             
            </View>


        </View>


    );
}


const styles = StyleSheet.create({
    touchable: {
        borderRadius: 10,
        overflow: "hidden",
    
        
        width:170,
        height:150,
        margin:10,

        

    },
    product: {
        height: 150,
        margin: 10,
        width:"100%"

    },
  

    blurContainerDetail: {
        height:"100%",
        width:"100%",

        borderRadius:10,
        backgroundColor: 'rgba(0, 0, 0, 0.5))',
        justifyContent: 'flex-end',
        alignItems: 'center',

    },
    details: {
        alignItems: 'center',

        padding: 10
    },
    title: {
        color: 'white',
        fontSize: 18,
        marginVertical: 4,
        fontFamily: 'oswald-bold',
    },




});


export default TripItem;
