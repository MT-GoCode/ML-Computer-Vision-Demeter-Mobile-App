import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, Picker, FlatList,Image,Button, TouchableHighlight } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default function ImageInput(props) {

  const [uri, setUri] = useState(null);
  const CONFIG = {
    allowsEditing: true,
    aspect: [1,1]
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
  }, []);

  const openCamera = async () => { const resp = await ImagePicker.launchCameraAsync(CONFIG);
    if (resp) {
      console.log(resp.uri);
        setUri(resp.uri);
    }
  };

  const openCameraRoll = async () => {
    const resp = await ImagePicker.launchImageLibraryAsync(CONFIG);
    if (resp)
      setUri(resp.uri);
  };

  return (
      <View>
        <Image style  = {{width:65, height: 65, margin: 50, padding: 50}} source = {require('../assets/tomatoicon.png')}/>
        <Text>Tomato</Text>
        <TouchableHighlight
            // title="Upload Image"
            style = {styles.button}
              onPress={openCameraRoll}
        >
            <Text>Upload Image</Text>
        </TouchableHighlight>

        <TouchableHighlight
            // title="Upload Image"
            style = {styles.button}
              onPress={openCamera}
        >
            <Text>Take Photo</Text>
        </TouchableHighlight>
        <Text>{uri}</Text>
        
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
  