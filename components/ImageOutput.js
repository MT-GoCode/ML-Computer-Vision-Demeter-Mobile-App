import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking
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
  },
  TextStyle: {
 
    color: 'blue',
    // textDecorationLine: 'underline'
 
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
                <View style= {{justifyContent:'center', width: 250}}>
                    <Text style={{fontWeight: "bold"}}>Disease Prediction: Early Blight{"\n"}</Text>

                    <Text style={{fontWeight: "bold"}}>Causes: </Text>
                    <Text><Text style={{fontStyle: "italic"}}>{`\u2022 Alternaria Solani`}</Text> fungus{"\n"}</Text>  
                    {/* {causes.map((cause) => {`\u2022 ${cause} `})} */}
                    

                    <Text style={{fontWeight: "bold"}}>Symptoms: </Text>
                    <Text>
                    
                        {`\u2022 Black or brown spots (usually 1 cm in diameter) `}{"\n"}
                        {`\u2022 Leaf spots are leathery and are often in concentric rings `}{"\n"}
                        {`\u2022 Fruit spots are sunken and dry and also have a concentric pattern `}{"\n"}
                        {/* {symptoms.map((symptom) => {`\u2022 ${symptom} `})} */}
                    </Text>
                    <Text style={{fontWeight: "bold"}}>Cures: </Text>
                    <Text>
                        {`\u2022 Avoid overhead irrigation ` +"\n"}
                        {`\u2022 Crop rotation is useful for infested gardens `}{"\n"}
                        {`\u2022 Copper fungicides applied at the first sign of infestation and repeated every 7 to 10 days may provide control `}{"\n"}
                        {/* {cures.map((cure) => {`\u2022 ${cure} `})} */}
                    </Text>
                    <Text style={{color: 'blue', textDecorationLine: 'underline'}} onPress={ ()=> Linking.openURL('http://ipm.ucanr.edu/PMG/GARDEN/VEGES/DISEASES/tomearlyblight.html') } >Click to visit the UCANR website for more information</Text>
                </View>

                <TouchableOpacity
                    style={styles2.imageWrapper}
                    onPress={() => {navigation.navigate("ImageInput")}}>

                    <Text style={styles.choosetext}>Input another photo</Text>
                </TouchableOpacity>
                
        </View>
        
    )
}

export default ImageOutput