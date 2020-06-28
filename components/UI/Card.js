
import React, { useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Image, ScrollView, TextInput } from 'react-native';


const Card= props =>{
    return (
        <View style={{...styles.card,...props.style}}>
            {props.children}
        </View>

    );

}
const styles=StyleSheet.create({
    card:{
        elevation: 5,
        backgroundColor: 'white',

    }
})

export default Card;
