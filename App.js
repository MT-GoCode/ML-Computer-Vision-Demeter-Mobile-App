import 'react-native-gesture-handler'; 
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import React, { useState, useEffect } from 'react';
// import { Text, View, TouchableOpacity } from 'react-native';
// import { Camera } from 'expo-camera';

// export default function App() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [type, setType] = useState(Camera.Constants.Type.back);

//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })();
//   }, []);

//   if (hasPermission === null) {
//     return <View />;
//   }
  
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   return (
//     <View style={{ flex: 1 }}>
//       <Camera style={{ flex: 1 }} type={type}>
//         <View
//           style={{
//             flex: 1,
//             backgroundColor: 'transparent',
//             flexDirection: 'row',
//           }}>
//           <TouchableOpacity
//             style={{
//               flex: 0.1,
//               alignSelf: 'flex-end',
//               alignItems: 'center',
//             }}
//             onPress={() => {
//               setType(
//                 type === Camera.Constants.Type.back
//                   ? Camera.Constants.Type.front
//                   : Camera.Constants.Type.back
//               );
//             }}>
//             <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
//           </TouchableOpacity>
//         </View>
//       </Camera>
//     </View>
//   );
// }
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SelectScreen from './components/SelectScreen'
import ImageInput from './components/ImageInput'
import ImageOutput from './components/ImageOutput'
import CameraRollPicker from 'react-native-camera-roll-picker';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

// import CameraRoll from './components/CameraRoll'
// import { RNCamera } from 'react-native-camera';
// import { Camera } from 'expo-camera';

function App() {
  const [selectedModel,setSelectedModel] = useState(null)
  const [hasPermission, setHasPermission] = useState(null);
  // const [type, setType] = useState(Camera.Constants.Type.back);

  

  return (
    
    <View style={styles.container} justifyContent = 'center'>
      {selectedModel}
      <ImageOutput uri="https://d384u2mq2suvbq.cloudfront.net/public/spree/products/1594/jumbo/Tomato-Leaf-Fragrance-Oil.jpg?1529607054" />
      
      
    </View>
  );
}
const MainStack  = createStackNavigator();
export default function MainStackScreen() { 
  return (
    <NavigationContainer >
      <MainStack.Navigator initialRouteName="ImageInput">
        <MainStack.Screen name="ImageInput" component={ImageInput} />
        <MainStack.Screen name="ImageOutput" component={ImageOutput} />
      </MainStack.Navigator>
    </NavigationContainer>
    
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
  },
});
