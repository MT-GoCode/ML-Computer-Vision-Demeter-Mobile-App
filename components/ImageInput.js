import React, { useState } from 'react';
import { StyleSheet, Text, View, Picker, FlatList,Image,Button, TouchableHighlight } from 'react-native';


export default function ImageInput(props) {
    return (
        <View>
        <Image style  = {{width:65, height: 65, margin: 50, padding: 50}} source = {require('../assets/tomatoicon.png')}/>
        <Text>Tomato</Text>
        <TouchableHighlight
            // title="Upload Image"
            style = {styles.button}
              onPress={() => {}}
        >
            <Text>Upload Image</Text>
        </TouchableHighlight>

        <TouchableHighlight
            // title="Upload Image"
            style = {styles.button}
              onPress={() => {}}
        >
            <Text>Take Photo</Text>
        </TouchableHighlight>
        
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
  