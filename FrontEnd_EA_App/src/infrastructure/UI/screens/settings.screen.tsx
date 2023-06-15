import React, { useEffect, useState } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { SessionService } from "../../services/user/session.service";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "react-native-paper";


const SettingsPage = () => {
  const [audioDescriptionEnabled, setAudioDescriptionEnabled] = useState(false);
  const navigation = useNavigation();

  //const [voiceControlEnabled, setVoiceControlEnabled] = useState(false);

  useEffect(() => {
    const getSessionInfo = async () => {
        const isAudioDescription = await SessionService.getAudioDescription();
        if (isAudioDescription === "si") {
        setAudioDescriptionEnabled(true);
        } else if (isAudioDescription === "no") {
        setAudioDescriptionEnabled(false);
        }

        /*
        const isVoiceControlEnabled = await SessionService.getVoiceControl();
        if (isVoiceControlEnabled === "si") {
        setVoiceControlEnabled(true);
        } else if (isVoiceControlEnabled === "no") {
        setVoiceControlEnabled(false);
        }
        */
    }
    getSessionInfo();
    
  }, []);

  const handleToggleAudioDescription = () => {
    const newAudioDescriptionEnabled = !audioDescriptionEnabled;
    setAudioDescriptionEnabled(newAudioDescriptionEnabled);
    SessionService.setAudioDescription(newAudioDescriptionEnabled ? "si" : "no");
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, headerTitleStyle: { color: '#66fcf1', fontSize: 30 }, title: 'Post a Publication',
    });
  }, [navigation]);

  /*
  const handleToggleVoiceControl = () => {
    const newVoiceControlEnabled = !voiceControlEnabled;
    setVoiceControlEnabled(newVoiceControlEnabled);
    SessionService.setVoiceControl(newVoiceControlEnabled ? "si" : "no");
  };
  */

  return (
    <View style={styles.container}>
        <View style={styles.settingsContainer}>
          <Text style={styles.title}>Audio Description</Text>
          <Text>Enable audio description</Text>
          <Switch
            value={audioDescriptionEnabled}
            onValueChange={handleToggleAudioDescription}
          />
        </View>
    </View>
  );
};

const styles = {
  settingsContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: 'transparent',
  },
  title: {
    color: 'black',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
};

export default SettingsPage;

/*
<View style={styles.settingsContainer}>
          <Text>Voice Control</Text>
          <Text>Enable voice control for navigation</Text>
          <Switch
            value={voiceControlEnabled}
            onValueChange={handleToggleVoiceControl}
          />
        </View>
*/
