import * as Font from 'expo-font'
import { FunctionComponent } from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

/*async function loadFonts() {
    await Font.loadAsync({
      'SF UI Display': require('../../../../../assets/fonts/SF-UI-Display-Semibold.ttf'),
    });
}*/

//loadFonts();

const styles = StyleSheet.create({
    text: {
        //fontFamily: 'SF UI Display',
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white',
        marginTop: 60,
    },
});

const NormalText: FunctionComponent<TextProps> = (props) => {
    return <Text style = {[styles.text, props.style]}>{props.children}</Text>
}

export default NormalText;