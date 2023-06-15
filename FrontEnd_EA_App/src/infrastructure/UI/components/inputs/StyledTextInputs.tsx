import React, { FunctionComponent } from 'react';
import { StyleSheet, TextInput } from 'react-native';
import * as Font from 'expo-font';
import { StyledTextInputProps } from './Types';

/*async function loadFonts() {
  await Font.loadAsync({
    //'SF UI Display': require('../../../assets/fonts/SF-UI-Display-Semibold.ttf'),
    'SF UI Display':require('../../../../../assets/fonts/SF-UI-Display-Semibold.ttf'),
  });
}

loadFonts();*/

const styles = StyleSheet.create({
    textInput: {
        //fontFamily: 'SF UI Display',
        fontWeight: 'bold',
        borderWidth: 0,
        borderColor: 'gray',
        width: '68%',
        height: 55,
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: '#66fcf1',
        paddingStart: 10,
        //placeholderTextColor: '#4e4e50',
    },
});

const StyledTextInputs: FunctionComponent<StyledTextInputProps> = ({ placeholder, style, value, onChangeText, secureTextEntry, editable, ...props }) => {
    return <TextInput placeholder={placeholder} style={[styles.textInput, style]} {...props} value={value}
    onChangeText={onChangeText} secureTextEntry={secureTextEntry} editable={editable}/>;
  };

export default StyledTextInputs;