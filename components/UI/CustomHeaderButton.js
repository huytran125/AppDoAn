import React,{useState} from 'react';
import { StyleSheet, Text, View,FlatList } from 'react-native';
import {HeaderButton} from 'react-navigation-header-buttons';



const CustomHeaderButton= props =>{
    return <HeaderButton  {...props}  />
}


export default CustomHeaderButton;