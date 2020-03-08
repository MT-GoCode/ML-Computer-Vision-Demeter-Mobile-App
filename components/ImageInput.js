import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Picker, FlatList,Image,Button, TouchableHighlight, ActivityIndicator,
  StatusBar,
  TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as tf from '@tensorflow/tfjs'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as jpeg from 'jpeg-js'
import Constants from 'expo-constants'


export default function ImageInput(props) {

  const [uri, setUri] = useState(null);
  const [model, setModel] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const CONFIG = {
    allowsEditing: true,
    aspect: [4,3]
  };

  useEffect(() => {
    (
      async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      // setHasPermission(status === 'granted');
      
    }
  )();
  (
    async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    // setHasPermission(status === 'granted');
    
  }
  )();
  //-------------------------------------------
  setModel((async () => {
    await tf.ready();
    const res = await mobilenet.load();
  if (!res) {
    console.log('ohno', res);
    return null;
  } return res;
  })())
  }, []);

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0 // offset into original data
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]

      offset += 4
    }

    return tf.tensor3d(buffer, [height, width, 3])
  }

  const classifyImage = async () => {
    try {
      setLoadingPredictions(true);
      const imageAssetPath = Image.resolveAssetSource(uri)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = imageToTensor(rawImageData)
      const new_predictions = await model.classify(imageTensor)
      setPrediction(new_predictions)
      console.log(predictions)
    } catch (error) {
      console.log(error)
    }
    setLoadingPredictions(false);
  }

  // ____________________________________________________________________________________________________
  
  

  const openCamera = async () => { const resp = await ImagePicker.launchCameraAsync(CONFIG);
    if (resp) {
      console.log(resp.uri);
      setUri(resp.uri);
      classifyImage()
    }
  };

  const openCameraRoll = async () => {
    const resp = await ImagePicker.launchImageLibraryAsync(CONFIG);
    if (resp){
      setUri(resp.uri);
      classifyImage()
    }
  };

  

  //hey

  return (
      <View>
        <Image style  = {{width:65, height: 65, margin: 50, padding: 50}} source = {require('../assets/tomatoicon.png')}/>
        <Text>Tomato</Text>

        { model === null && <ActivityIndicator size='small' /> && <Text>AAAAAA</Text> }
        
        <TouchableHighlight
            // title="Upload Image"
            style = {styles.button}
              onPress={openCameraRoll}
            disabled = {model === null}
        >
            <Text>Upload Image</Text>
        </TouchableHighlight>

        <TouchableHighlight
            // title="Upload Image"
            style = {styles.button}
            onPress={openCamera}
            disabled = {model === null}
        >
            <Text>Take Photo</Text>
        </TouchableHighlight>
        <Text>{uri}</Text>

  { uri && <Image style  = {{width:65, height: 65, margin: 50, padding: 50}} source = {{ uri: uri}}/> } 
        {/* // only displays image if uri exists */}
        {loadingPredictions && <Text> Loading predictions...</Text>}
        {prediction && prediction.map(p => <Text key={p.className}>* {p.className}</Text>)}
      </View>
    );
}




const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 10
    },
    button: {
      alignItems: 'center',
      backgroundColor: '#DDDDDD',
      padding: 10
    },
    countContainer: {
      alignItems: 'center',
      padding: 10
    },
    countText: {
      color: '#FF00FF'
    }
  })
  