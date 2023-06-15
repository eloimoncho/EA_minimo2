import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import React, {useRef, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  ClientRoleType,
  createAgoraRtcEngine,
  IRtcEngine,
  ChannelProfileType,
} from 'react-native-agora';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import ActiveCall from './../../components/videocall/ActiveCall'
import InactiveCall from './../../components/videocall/InactiveCall'

const appId = 'e6456627f2ca4665abd3008f313c7c80';
const channel = 'Zoom Teme Ante Nosotros';
const token =
  '007eJxTYNgfNTU5SbnHcNnT+GSZp8ohQgY70tSrXqX8Paz6QK8/VEaBIdXMxNTMzMg8zSg50cTMzDQxKcXYwMAizdjQONk82cLg/KvOlIZARgaxC96sjAwQCOKzMvgU5CTmMTAAAP9LHnk=';
const localUid = 0;

export default function videocallAg() {
  useKeepAwake();

  const agoraEngineRef = useRef<IRtcEngine>(); // Instancia de Agora

  const [isJoined, setIsJoined] = useState(false); // Indica si el usuario local se unio al canal
  const [isMute, setIsMute] = useState(false); // Indica si el usuario local se unio al canal

  const [remoteUid, setRemoteUid] = useState(0); // Uid of the remote user

  const getPermission = async () => {
    if (Platform.OS !== 'android') {
      // El info.plist es el que se ocupara del lado de iOS
      return;
    }

    // Pedimos los premisos adecuados para Android
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      PermissionsAndroid.PERMISSIONS.CAMERA,
    ]);
  };

  const setupVideoSDKEngine = async () => {
    try {
      // Llamamos a los permisos
      await getPermission();

      // Le damos el valor a nuestra instancia de Agora
      agoraEngineRef.current = createAgoraRtcEngine();
      const agoraEngine = agoraEngineRef.current;

      agoraEngine.registerEventHandler({
        onJoinChannelSuccess: () => {
          // Este es un listener que se ejecutara cada vez que nos conectemos a un canal correctamente.
          setIsJoined(true);
        },
        onUserJoined: (_connection, Uid) => {
          // Este es un listener que nos dira cuando un usuario se conecta
          setRemoteUid(Uid);
        },
        onUserOffline: (_connection, _Uid) => {
          // Este es un listener que nos dira cuando un usuario se desconecta
          setRemoteUid(0);
        },
        onError: (errorCode, msg) => {
          console.log('Error Code', errorCode);
          console.log('Mesasge:', msg);
        },
      });
      agoraEngine.initialize({
        appId,
      });
      agoraEngine.enableVideo();
    } catch (e) {
      console.log(e);
    }
  };

  const join = async () => {
    if (isJoined) {
      // Si ya nos encontramos en la llamada, no hacemos nada.
      return;
    }

    // Dejamos que la instancia de AGORA nos asigne el canal y nos una.
    try {
      agoraEngineRef.current?.setChannelProfile(
        ChannelProfileType.ChannelProfileCommunication,
      );
      agoraEngineRef.current?.startPreview();
      agoraEngineRef.current?.joinChannel(token, channel, localUid, {
        clientRoleType: ClientRoleType.ClientRoleBroadcaster,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const leave = () => {
    // Cuando deseamos salir del canal.
    try {
      agoraEngineRef.current?.leaveChannel();

      setIsJoined(false);
      setIsMute(false);

      setRemoteUid(0);
    } catch (e) {
      console.log(e);
    }
  };

  const muteMic = () => {
    try {
      agoraEngineRef.current?.muteLocalAudioStream(!isMute);

      setIsMute(!isMute);
    } catch (e) {
      console.log(e);
    }
  };

  const switchCamera = () => {
    try {
      agoraEngineRef.current?.switchCamera();
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    // Inicializamos el motor de Agora cuando inicia la app
    setupVideoSDKEngine();
  }, []);

  useEffect(() => {
    console.log(isJoined);
  }, [isJoined]);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {isJoined ? (
          <ActiveCall
            localUid={localUid}
            remoteUid={remoteUid}
            isMute={isMute}
            onMuteMicPress={muteMic}
            onSwitchCameraPress={switchCamera}
            onLeavePress={leave}
          />
        ) : (
          <InactiveCall onJoinChannelPress={join} />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});