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
// require('@tensorflow/tfjs-node')
import { fetch, bundleResourceIO, decodeJpeg } from '@tensorflow/tfjs-react-native'
import * as mobilenet from '@tensorflow-models/mobilenet'
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker'
import Constants from 'expo-constants'
import * as Permissions from 'expo-permissions'

const CONFIG = {
  allowsEditing: true,
  aspect: [4,3]
};

class ImageInput extends React.Component {

  state = {
    isTfReady: false,
    isModelReady: false,
    predictions: null,
    image: null,
    uri: null
  }

  async componentDidMount() {
    await tf.ready()
    this.setState({
      isTfReady: true
    })
    // console.log(this.props)
    
    // this.model = await mobilenet.load() // ORIGINALLY LOADING MOBILE NETS
    this.model = await this.loadModel('tfjs_model_to_use')
    console.log('model after fetch: ' + this.model)
    // this.loadModel('tfjs_model_to_use')
    this.setState({ isModelReady: true })
    // this.camperm()
    // this.camrollperm()
    this.getPermissionAsync()
  }
  
  loadModel = async (name) => {
    // model = undefined; 
    // console.log('weowi;rjg')
    try {
      const modelJson = require('../assets/tfjs_model_to_use/model.json')
      const modelWeights = require('../assets/tfjs_model_to_use/group1-shard1of1.bin')
      console.log('fetching now')
      return await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights))//'file://tfjs-models/tfjs_model_to_use/content/tfjs_model_to_use/model.json')//'https://storage.googleapis.com/tfjs-models/tfjs/iris_v1/model.json')
      // local load look at google's main example - why cant it resolve .bin?
      // online load, server?
    }
    catch (error) {
      console.log('dfslkmlsemo')
      console.log(error)
    }
    // model = await tf.loadModel('../tfjs-models/tfjs_model_to_use/content/tfjs_model_to_use/model.json')//(`http://localhost:81/tfjs-models/${name}/model.json`); //replace localhost w/ 10.0.0.14
  }

  // camperm = async() => {
  //   if (Constants.platform.ios) {
  //     const { statusCam } = await Permissions.askAsync(Permissions.CAMERA)
  //     if (statusCam !== 'granted') {
  //       alert('Sorry, we need camera permissions to make this work!')
  //     }
  //   }
  // }

  // camrollperm = async () => {
    
  //     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL)
  //     if (status !== 'granted') {
  //       alert('Sorry, we need camera roll permissions to make this work!')
  //     }
  // }

  getPermissionAsync = async () => {
      const { status } =  await Permissions.askAsync(
        Permissions.CAMERA_ROLL,
        Permissions.CAMERA
      )
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
  }

  imageToTensor(rawImageData) {
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

  classifyImage = async () => {
    try {


      console.log('model right before classification: ' + this.model)
      console.log('uri to classify: ' + this.state.uri)
      const response = await fetch(this.state.uri, {}, { isBinary: true });
      console.log('response: ' + response)
      const imageData = await response.arrayBuffer();
      console.log('imageData: ' + imageData)
      const imageTensor = decodeJpeg(imageData);
      console.log('imageTensor: ' + imageData)
      const prediction = (await this.model.predict(imageTensor))[0];
      // const imageAssetPath = Image.resolveAssetSource(this.state.image)
      // const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      // const rawImageData = await response.arrayBuffer()
      // const imageTensor = this.imageToTensor(rawImageData)
      // const predictions = await this.model.predict(imageTensor)

      
      this.setState({ predictions: prediction })
      // this.props.navigation.navigate("ImageOutput", {uri: this.state.uri, predictions: predictions})
      // console.log("pred" + predictions)
      // console.log(predictions)

      // ------------


      // ------------
    } catch (error) {
      console.log(error)
    }
  }

  // selectImage = async () => {
  //   try {
  //     let response = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ImagePicker.MediaTypeOptions.All,
  //       allowsEditing: true,
  //       aspect: [4, 3]
  //     })
  //     console.log(response.uri)
  //     if (!response.cancelled) {
  //       const source = { uri: response.uri }
  //       this.setState({ image: source })
  //       this.classifyImage()
  //     }
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }
  selectImage = async () => {
    let resp = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1]
    })
    if (resp) {
      // console.log(resp.uri);
      console.log(resp)
      const source = { uri: resp.uri }
      this.setState({ image: source, uri: resp.uri});
      this.classifyImage()
      
    }
  }

  
  takePhoto = async () => { 
    const resp = await ImagePicker.launchCameraAsync(CONFIG);
    if (resp) {
      // console.log(resp.uri);
      const source = { uri: resp.uri }
      this.setState({ image: source,uri:resp.uri})
      this.classifyImage()
    }
  };

  renderPrediction = prediction => {
    // console.log(prediction)
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }

  render() {
    const { isTfReady, isModelReady, predictions, image, uri } = this.state

    return (
      <View style={styles.container} justifyContent = 'center'>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
          <Text style={{fontSize: 40, fontWeight: 'bold'}}>Tomato Model</Text>
          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>Please wait for the tomato to appear:</Text>
            {isModelReady ? (
              <Text style={styles.text}>🍅</Text>
            ) : (
              <ActivityIndicator size='small' />
            )}
          </View>
        </View>

        <View style = {styles.imageContainer}>
          {<Image source={uri === null ? {uri:'https://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder.png'} : {uri:uri}} style = {styles.imageContainer} />}
        </View>

        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.takePhoto : undefined}>
        
          {(
            <Text style={styles.choosetext} >Tap to take a photo</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>

          {(
            <Text style={styles.choosetext}>Tap to upload photo</Text>
          )}
        </TouchableOpacity>

        <View style={styles.predictionWrapper}>
          {isModelReady && image && (
            <Text style={styles.text}>
              Predictions: {predictions ? '' : 'Predicting...'}
            </Text>
          )}
          {isModelReady &&
            predictions &&
            predictions.map(p => this.renderPrediction(p))}
        </View>
      </View>
    )
  }
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#171f24',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  loadingContainer: {
    marginTop: 80,
    justifyContent: 'center'
  },
  text: {
    // color: '#ffffff',
    fontSize: 16
  },
  choosetext: {
    fontWeight: "bold",
    color: '#ffffff',
    fontSize: 16
  },
  loadingModelContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  imageWrapper: {
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
  imageContainer: {
    width: 250,
    height: 250,
    position: 'relative',
    // top: 10,
    // left: 10,
    // bottom: 10,
    // right: 10,
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  // transparentText: {
  //   color: '#ffffff',
  //   opacity: 0.7
  // },
  footer: {
    marginTop: 40
  },
  poweredBy: {
    fontSize: 20,
    color: '#e69e34',
    marginBottom: 6
  },
  tfLogo: {
    width: 125,
    height: 70
  }
})

export default ImageInput

// import React, {useState, useEffect} from 'react';
// import { StyleSheet, Text, View, Picker, FlatList,Image,Button, TouchableHighlight, ActivityIndicator,
//   StatusBar,
//   TouchableOpacity } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import * as Permissions from 'expo-permissions';
// import * as tf from '@tensorflow/tfjs'
// import { fetch } from '@tensorflow/tfjs-react-native'
// import * as mobilenet from '@tensorflow-models/mobilenet'
// import * as jpeg from 'jpeg-js'
// import Constants from 'expo-constants'

// export default function ImageInput(props) {

//   const [uri, setUri] = useState(null);
//   const [image, setImage] = useState(null)
//   const [predictions, setPredictions] = useState(null)
//   const [isModelReady, setisModelReady] = useState(false)
//   // state = {
//   //   isTfReady: false,
//   //   isModelReady: false,
//   //   predictions: null,
//   //   image: null
//   // }

//   const CONFIG = {
//     allowsEditing: true,
//     aspect: [4,3]
//   };

//   const componentDidMount = async () => {
//     await tf.ready()
//     setisModelReady(false)
//     this.model = await mobilenet.load()
//     setisModelReady(true)
//     this.getPermissionAsync()
//   }

//   const imageToTensor = (rawImageData) => {
//     const TO_UINT8ARRAY = true
//     const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
//     // Drop the alpha channel info for mobilenet
//     const buffer = new Uint8Array(width * height * 3)
//     let offset = 0 // offset into original data
//     for (let i = 0; i < buffer.length; i += 3) {
//       buffer[i] = data[offset]
//       buffer[i + 1] = data[offset + 1]
//       buffer[i + 2] = data[offset + 2]

//       offset += 4
//     }

//     return tf.tensor3d(buffer, [height, width, 3])
//   }

//   const classifyImage = async () => {
//     try {
//       const imageAssetPath = Image.resolveAssetSource(image)
//       const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
//       const rawImageData = await response.arrayBuffer()
//       const imageTensor = this.imageToTensor(rawImageData)
//       const new_predictions = await this.model.classify(imageTensor)
//       setPredictions(new_predictions)
//       console.log(predictions)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const renderPrediction = prediction => {
//     return (
//       <Text key={prediction.className}>
//         {prediction.className}
//       </Text>
//     )
//   }
//   // ---------------------------------------------------------------
//   useEffect(() => {
//     (
//       async () => {
//       const { status } = await Permissions.askAsync(Permissions.CAMERA);
//       // setHasPermission(status === 'granted');
      
//     }
//   )();
//   (
//     async () => {
//     const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
//     // setHasPermission(status === 'granted');
    
//   }
//   )();
//   }, []);

//   const openCamera = async () => { const resp = await ImagePicker.launchCameraAsync(CONFIG);
//     if (resp) {
//       console.log(resp.uri);
//         setUri(resp.uri);
//     }
//   };

//   const openCameraRoll = async () => {
//     const resp = await ImagePicker.launchImageLibraryAsync(CONFIG);
//     if (resp){
//       setUri(resp.uri);
//     }
//   };








//   //hey

//   return (
//       <View>
//         <Image style  = {{width:65, height: 65, margin: 50, padding: 50}} source = {require('../assets/tomatoicon.png')}/>
//         <Text  style={{textAlignVertical: "center",textAlign: "center",fontWeight:"bold",fontSize:50,}}>Tomato</Text>
//         <TouchableHighlight
//             // title="Upload Image"
//             style = {styles.button}
//               onPress={openCameraRoll}
//         >
//             <Text>Upload Image</Text>
//         </TouchableHighlight>

//         <TouchableHighlight
//             // title="Upload Image"
//             style = {styles.button}
//               onPress={openCamera}
//         >
//             <Text>Take Photo</Text>
//         </TouchableHighlight>
//         <Text>{uri}</Text>

//   { uri && <Image style  = {{width:200, height: 200, margin: 50, padding: 50}} source = {{ uri: uri}}/> }
//         {/* displaying image if uri exists, src weirdly takes an object of the uri*/}
      
      
//         <View>
//       {isModelReady && image && (
//         <Text>
//           Predictions: {predictions ? '' : 'Predicting...'}
//         </Text>
//       )}
//       {isModelReady &&
//         predictions &&
//         predictions.map(p => renderPrediction(p))}
//       </View>
      
      
//       </View>

      
//     );
// }




// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       paddingHorizontal: 10
//     },
//     button: {
//       alignItems: 'center',
//       backgroundColor: '#DDDDDD',
//       padding: 10
//     },
//     countContainer: {
//       alignItems: 'center',
//       padding: 10
//     },
//     countText: {
//       color: '#FF00FF'
//     }
//   })
  