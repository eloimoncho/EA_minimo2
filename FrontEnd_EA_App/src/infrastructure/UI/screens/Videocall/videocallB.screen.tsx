import React, {useEffect, useState, useCallback} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Text} from 'react-native-paper';
import {Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TextInput} from 'react-native-paper';

import {NavigationProp, useFocusEffect, useNavigation} from '@react-navigation/native';



import InCallManager from 'react-native-incall-manager';
//import { RTCView, mediaDevices } from 'react-native-webrtc';


export default function VideocallScreenB(props:any) {
const navigation = useNavigation();
  let name:any;
  let connectedUser:any;
  const [offer, setOffer] = useState<any>(null);
  const [userId, setUserId] = useState('');
  const [socketActive, setSocketActive] = useState(false);
  const [calling, setCalling] = useState(false);
  // Video Scrs
  const [localStream, setLocalStream] = useState({toURL: () => null});
  const [remoteStream, setRemoteStream] = useState({toURL: () => null});

  const [conn, setConn] = useState(new WebSocket('ws://http://147.83.7.158:3000'));
  function yourConn() {
    console.log("ayo")
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:147.83.7.158:3478",
        },
        {
          urls: "turn:147.83.7.158:3478",
          credential: "oursecret",
          username: "coturn",
        },
      ],
    });
    return peer;
  } //Puede dar problemas


  const [callToUsername, setCallToUsername] = useState(null);

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('userId').then((id:any) => {
        console.log(id);
        if (id) {
          setUserId(id);
        } else {
          setUserId('');
          navigation.navigate('VideocallScreenA'as never)
        }
      });
    }, [userId]),
  );

  useEffect(() => {
    navigation.setOptions({
      title: 'Your ID - ' + userId,
      headerRight: () => (
        <Button mode="text" onPress={onLogout} style={{paddingRight: 10}}>
          Logout
        </Button>
      ),
    });
  }, [userId]);

  /**
   * Calling Stuff
   */

  useEffect(() => {
    if (socketActive && userId.length > 0) {
      try {
        InCallManager.start({media: 'audio'});
        InCallManager.setForceSpeakerphoneOn(true);
        InCallManager.setSpeakerphoneOn(true);
      } catch (err) {
        console.log('InApp Caller ---------------------->', err);
      }

      console.log(InCallManager);

      send({
        type: 'login',
        name: userId,
      });
    }
  }, [socketActive, userId]);

  const onLogin = () => {};

  useEffect(() => {
    /**
     *
     * Sockets Signalling
     */
    conn.onopen = () => {
      console.log('Connected to the signaling server');
      setSocketActive(true);
    };
    //when we got a message from a signaling server
    conn.onmessage = msg => {
      let data;
      if (msg.data === 'Hello world') {
        data = {};
      } else {
        data = JSON.parse(msg.data);
        console.log('Data --------------------->', data);
        switch (data.type) {
          case 'login':
            console.log('Login');
            break;
          //when somebody wants to call us
          case 'offer':
            handleOffer(data.offer, data.name);
            console.log('Offer');
            break;
          case 'answer':
            handleAnswer(data.answer);
            console.log('Answer');
            break;
          //when a remote peer sends an ice candidate to us
          case 'candidate':
            handleCandidate(data.candidate);
            console.log('Candidate');
            break;
          case 'leave':
            handleLeave();
            console.log('Leave');
            break;
          default:
            break;
        }
      }
    };
    conn.onerror = function(err) {
      console.log('Got error', err);
    };
    /**
     * Socjket Signalling Ends
     */

    let isFront = false;
    if(mediaDevices && mediaDevices.enumerateDevices){
    mediaDevices.enumerateDevices().then((sourceInfos:any) => {
      let videoSourceId;
      for (let i = 0; i < sourceInfos.length; i++) {
        const sourceInfo = sourceInfos[i];
        if (
          sourceInfo.kind == 'videoinput' &&
          sourceInfo.facing == (isFront ? 'front' : 'environment')
        ) {
          videoSourceId = sourceInfo.deviceId;
        }
      }
      mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            mandatory: {
              minWidth: 500, // Provide your own width, height and frame rate here
              minHeight: 300,
              minFrameRate: 30,
            },
            facingMode: isFront ? 'user' : 'environment',
            optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
          },
        })
        .then((stream:any) => {
          // Got stream!
          setLocalStream(stream);

          // setup stream listening
          stream.getTracks().forEach((track:any) => yourConn().addTrack(track, stream));
        })
        .catch(error => {
          // Log error
        });
    });
  }else{
    console.log("No devices")
  }

    yourConn().ontrack = (event:any) => {
      console.log('On Track', event);
      if (event.track.kind === 'video') {
        setRemoteStream(event.streams[0]);
      }
    };
    

    // Setup ice handling
    yourConn().onicecandidate = event => {
      if (event.candidate) {
        send({
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };
  }, []);

  const send = (message:any) => {
    //attach the other peer username to our messages
    if (connectedUser) {
      message.name = connectedUser;
      console.log('Connected iser in end----------', message);
    }

    conn.send(JSON.stringify(message));
  };

  const onCall = () => {
    setCalling(true);

    connectedUser = callToUsername;
    console.log('Caling to', callToUsername);
    // create an offer

    yourConn().createOffer().then(offer => {
      yourConn().setLocalDescription(offer).then(() => {
        console.log('Sending Ofer');
        console.log(offer);
        send({
          type: 'offer',
          offer: offer,
        });
        // Send pc.localDescription to peer
      });
    });
  };

  //when somebody sends us an offer
  const handleOffer = async (offer:any, name:any) => {
    console.log(name + ' is calling you.');

    console.log('Accepting Call===========>', offer);
    connectedUser = name;

    try {
      await yourConn().setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await yourConn().createAnswer();

      await yourConn().setLocalDescription(answer);
      send({
        type: 'answer',
        answer: answer,
      });
    } catch (err) {
      console.log('Offerr Error', err);
    }
  };

  //when we got an answer from a remote user
  const handleAnswer = (answer:any) => {
    yourConn().setRemoteDescription(new RTCSessionDescription(answer));
  };

  //when we got an ice candidate from a remote user
  const handleCandidate = (candidate:any) => {
    setCalling(false);
    console.log('Candidate ----------------->', candidate);
    yourConn().addIceCandidate(new RTCIceCandidate(candidate));
  };

  //hang up
  const hangUp = () => {
    send({
      type: 'leave',
    });

    handleLeave();
  };

  const handleLeave = () => {
    connectedUser = null;
    setRemoteStream({toURL: () => null});

    yourConn().close();
    // yourConn.onicecandidate = null;
    // yourConn.onaddstream = null;
  };

  const onLogout = () => {
    // hangUp();

    AsyncStorage.removeItem('userId').then((res:any) => {
      navigation.navigate('VideocallScreenA' as never);
    });
  };

  const acceptCall = async () => {
    if (offer && offer.name) {
      console.log('Accepting Call===========>', offer);
      connectedUser = offer.name;
  
      try {
        await yourConn().setRemoteDescription(new RTCSessionDescription(offer));
  
        const answer = await yourConn().createAnswer();
  
        await yourConn().setLocalDescription(answer);
  
        send({
          type: 'answer',
          answer: answer,
        });
      } catch (err) {
        console.log('Offer Error', err);
      }
    }
  };
  
  
  
  const rejectCall = async () => {
    send({
      type: 'leave',
    });
    ``;
    setOffer(null);

    handleLeave();
  };

  /**
   * Calling Stuff Ends
   */

  return (
    <View style={styles.root}>
      <View style={styles.inputField}>
        <TextInput
          label="Enter Friends Id"
          mode="outlined"
          style={{marginBottom: 7}}
          onChangeText={text => setCallToUsername(text as any)}
        />
        <Button
          mode="contained"
          onPress={onCall}
          loading={calling}
          //   style={styles.btn}
          contentStyle={styles.btnContent}
          disabled={!(socketActive && userId.length > 0)}>
          Call
        </Button>
      </View>

      <View style={styles.videoContainer}>
        <View style={[styles.videos, styles.localVideos]}>
          <Text>Your Video</Text>
          <RTCView streamURL={localStream.toURL() || ''} style={styles.localVideo} />
        </View>
        <View style={[styles.videos, styles.remoteVideos]}>
          <Text>Friends Video</Text>
          <RTCView streamURL={remoteStream.toURL() || ''} style={styles.remoteVideo} />

        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  inputField: {
    marginBottom: 10,
    flexDirection: 'column',
  },
  videoContainer: {
    flex: 1,
    minHeight: 450,
  },
  videos: {
    width: '100%',
    flex: 1,
    position: 'relative',
    overflow: 'hidden',

    borderRadius: 6,
  },
  localVideos: {
    height: 100,
    marginBottom: 10,
  },
  remoteVideos: {
    height: 400,
  },
  localVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  remoteVideo: {
    backgroundColor: '#f2f2f2',
    height: '100%',
    width: '100%',
  },
  btnContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
});