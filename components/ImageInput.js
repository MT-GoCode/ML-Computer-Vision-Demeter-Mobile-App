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
    this.model = await mobilenet.load()
    this.setState({ isModelReady: true })
    // this.camperm()
    // this.camrollperm()
    this.getPermissionAsync()
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
      const imageAssetPath = Image.resolveAssetSource(this.state.image)
      const response = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      const rawImageData = await response.arrayBuffer()
      const imageTensor = this.imageToTensor(rawImageData)
      const predictions = await this.model.classify(imageTensor)
      this.setState({ predictions })
      console.log(predictions)
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
            aspect: [4, 3]
    })
    if (resp) {
      console.log(resp.uri);
      const source = { uri: resp.uri }
      this.setState({ image: source});
      this.classifyImage()
      
    }
  }

  
  takePhoto = async () => { 
    const resp = await ImagePicker.launchCameraAsync(CONFIG);
    if (resp) {
      console.log(resp.uri);
      const source = { uri: resp.uri }
      this.setState({ image: source})
      this.classifyImage()
    }
  };

  renderPrediction = prediction => {
    console.log(prediction)
    return (
      <Text key={prediction.className} style={styles.text}>
        {prediction.className}
      </Text>
    )
  }

  render() {
    const { isTfReady, isModelReady, predictions, image, uri } = this.state

    return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' />
        <View style={styles.loadingContainer}>
          <Text style={styles.text}>
            TFJS ready? {isTfReady ? <Text>✅</Text> : ''}
          </Text>

          <View style={styles.loadingModelContainer}>
            <Text style={styles.text}>Model ready? </Text>
            {isModelReady ? (
              <Text style={styles.text}>✅</Text>
            ) : (
              <ActivityIndicator size='small' />
            )}
          </View>
        </View>

        <View style = {styles.imageContainer}>
          {uri && <Image source={image} style = {styles.imageContainer} />}
        </View>

        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.takePhoto : undefined}>
        
          {isModelReady && !image && (
            <Text style={styles.choosetext} >Tap to take a photo</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.imageWrapper}
          onPress={isModelReady ? this.selectImage : undefined}>

          {isModelReady && !image && (
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

const styles = StyleSheet.create({
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
    width: 280,
    height: 50,
    padding: 10,
    borderColor: '#006600',
    borderWidth: 2,
    borderRadius: 50,
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
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#009900"
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
  