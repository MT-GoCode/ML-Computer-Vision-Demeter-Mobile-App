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





function ImageOutput(props) {
    const {uri, predictions} = props;

    return (
        <View style={styles.container} justifyContent = 'center'>
            <View style = {styles.imageContainer}>
                <Text style={{fontSize: 31, fontWeight: 'bold', textAlign: 'center'}}>Tomato Results</Text>
<Text> {uri}</Text>
                <Image source={{uri:uri}} style = {styles.imageContainer} />
                <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={() => {}}>

                    <Text style={styles.choosetext}>Input another photo</Text>
                </TouchableOpacity>
            </View>
        </View>
        
    )
}
export default ImageOutput