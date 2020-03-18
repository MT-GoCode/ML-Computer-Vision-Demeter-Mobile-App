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
function Info() {

    // for now only specifying one prediction, once we configure to top three we will specify them in array
    const predictions = 'Early Blight'

    return (
        
        <View style={styles.container} justifyContent = "flex-start" >
            <Text>
                Disease Prediction:
                {predictions}
            </Text>
        </View>
    )
}

export default Info