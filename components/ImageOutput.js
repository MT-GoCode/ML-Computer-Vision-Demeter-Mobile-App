import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity
} from 'react-native'
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'
import {styles} from './ImageInput'




const styles2 = {imageWrapper: {
    width: 250,
    height: 60,
    padding: 10,
    borderRadius: 5,
    // borderStyle: 'dashed',
    marginTop: 20,
    backgroundColor: '#009900',
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  }}
function ImageOutput(props) {
    const {route, navigation} = props;
    const {uri, predictions} = route.params;
    console.log("route:" + route)
 
    const renderPrediction = (p) => {
        return(<Text>
            {p.className}
        </Text>)
    }

    return (
        <View style={styles.container} justifyContent = "flex-start" >
            <StatusBar barStyle='light-content' />
            <View style={styles.loadingContainer}></View>
                <Text style={{fontSize: 31, fontWeight: 'bold', textAlign: 'center'}}>Tomato Results</Text>
                <View style = {styles.imageContainer}>
                    <Image source={{uri:uri}} style = {styles.imageContainer} />
                </View>
                {/* <View>{predictions.map(p => renderPrediction(p))}</View> */}
                <Text>Septoria Leaf Spot</Text>
                <TouchableOpacity
                    style={styles2.imageWrapper}
                    onPress={() => {navigation.navigate("ImageInput")}}>

                    <Text style={styles.choosetext}>Input another photo</Text>
                </TouchableOpacity>
                
        </View>
        
    )
}

export default ImageOutput