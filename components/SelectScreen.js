import React, { useState } from 'react';
import { StyleSheet, Text, View, Picker, FlatList } from 'react-native';

const DATA = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'First Item',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'Second Item',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'Third Item',
  },
];

export default function SelectScreen(props) {
  const {setSelectedModel} = props
  return (
      <View>
        <Text>
          Demeter
        </Text>
        {/* <FlatList
          data={DATA}
          renderItem={({ item }) => <Text>{item.title}</Text>}
          keyExtractor={item => item.id}
        /> */}
        <Picker
          onValueChange = {(value) => {setSelectedModel(value)}}
          >
          <Picker.Item label = "Default" value = "Select..."/>
          <Picker.Item label = "Apple" value = "Apple"/>
          <Picker.Item label = "Tomato" value = "Tomato"/>
          <Picker.Item label = "Grape" value = "Grape"/>
          <Picker.Item label = "Potato" value = "Potato"/>
          <Picker.Item label = "Tomato" value = "Tomato"/>

        </Picker>
      </View>
    );
}