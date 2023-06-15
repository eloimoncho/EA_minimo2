import React, { useState, useRef, useEffect, useCallback } from "react";
import { GiftedChat, IMessage } from "react-native-gifted-chat";
import { Text, View, StyleSheet, TextInput, Button, ImageBackground } from "react-native";
import { Socket, io } from "socket.io-client";
import socketIOClient from "socket.io-client";
import { useNavigation } from '@react-navigation/native';

import { RouteProp, useRoute } from "@react-navigation/native";

interface RouteParams {
  roomID?: string;
}

const ChatB = () => {
  const peerRef = useRef<any>();
  let socketRef = useRef<Socket | undefined>();
  const otherUser = useRef<any>();
  const sendChannel = useRef<RTCDataChannel | undefined>(); //Data channel
  const route = useRoute();
  const {roomID}: RouteParams = route.params || {};
  console.log("Mi Room ID es: "+roomID);
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]); // Chats between the peers will be stored here

  React.useLayoutEffect(() => {
    navigation.setOptions({
        headerTitle: 'Chat',
        headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
        headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
    });
}, [navigation]);


  useEffect(() => {
    // Step 1: Connect with the Signal server

    try {
      console.log("hola")
      socketRef.current = socketIOClient('http://147.83.7.158:3000'); // Address of the Signal server REVISAR
      //socketRef.current = socketIOClient('http://localhost:3000');
      console.log('Socket:  '+socketRef.current);
    } catch (error) {
      console.log("Error connecting with signal server");
    }
    // Step 2: Join the room. If initiator we will create a new room otherwise we will join a room
    try {
      if (socketRef.current) {
        socketRef.current.emit("join room", roomID); // Room ID
        console.log("RoomID:  "+roomID)
        console.log("estoy aqui")
      } else {
        console.log("socketRef.current void");
      }
    } catch (error) {
      console.log("Cannot connect to room");
    }

    // Step 3: Waiting for the other peer to join the room
    try {
      if (socketRef.current) {
        console.log("Waiting...")
        //console.log(socketRef.current);

        socketRef.current.on("other user", (userID:any) => {
          console.log('UserID: '+userID)
          callUser(userID);
          otherUser.current = userID;
        });
      } else {
        console.log("socketRef.current void");
      }
    } catch (error) {
      console.log("Error on waiting the other peer");
    }

    // Signals that both peers have joined the room
    if(socketRef.current){
    socketRef.current.on("user joined", (userID:any) => {
      otherUser.current = userID;
    });

    socketRef.current.on("offer", handleOffer);
    console.log("ey")
    
    socketRef.current.on("answer", handleAnswer);

    socketRef.current.on("ice-candidate", handleNewICECandidateMsg);}
    
  }, []);

  function callUser(userID: any) {
    // This will initiate the call for the receiving peer
    console.log("[INFO] Initiated a call");
    try {
      console.log("try de call user...")
        console.log("usus:  "+userID)
        peerRef.current = Peer(userID);
        console.log("peer:  "+peerRef.current)
        sendChannel.current = peerRef.current.createDataChannel("sendChannel");
        if (sendChannel.current)
          // listen to incoming messages from other peer
          sendChannel.current.onmessage = handleReceiveMessage;
      
    } catch (error) {
      console.log("error on callUser");
    }
  }

  function Peer(userID: string) {
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
    console.log("ayo2")
    peer.onicecandidate = handleICECandidateEvent;
    peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);
    return peer;
  } //Puede dar problemas

  function handleNegotiationNeededEvent(userID: string) {
    // Offer made by the initiating peer to the receiving peer.
    peerRef.current
      .createOffer()
      .then((offer: RTCSessionDescriptionInit) => {
        return peerRef.current.setLocalDescription(offer);
      })
      .then(() => {
        const payload = {
          target: userID,
          caller: socketRef.current?.id,
          sdp: peerRef.current.localDescription,
        };
        socketRef.current?.emit("offer", payload);
      })
      .catch((err: Error) =>
        console.log("Error handling negotiation needed event", err)
      );
  }

  function handleOffer(incoming: any) {
    //Here we are exchanging config information
    //between the peers to establish communication

    console.log("[INFO] Handling Offer");
    peerRef.current = Peer(incoming.caller); //Revisar
    peerRef.current.ondatachannel = (event: any) => {
      sendChannel.current = event.channel;
      if (sendChannel.current) {
        sendChannel.current.onmessage = handleReceiveMessage;
      }

      console.log("[SUCCESS] Connection established");
    };

    //Session Description: It is the config information of the peer
    //SDP stands for Session Description Protocol. The exchange
    //of config information between the peers happens using this protocol

    const desc = new RTCSessionDescription(incoming.sdp);

    //Remote Description : Information about the other peer
    //Local Description: Information about you 'current peer'

    peerRef.current
      .setRemoteDescription(desc)
      .then(() => {})
      .then(() => {
        return peerRef.current.createAnswer();
      })
      .then((answer: any) => {
        //revisar
        return peerRef.current.setLocalDescription(answer);
      })
      .then(() => {
        const payload = {
          target: incoming.caller,
          caller: socketRef.current?.id,
          sdp: peerRef.current.localDescription,
        };
        if (socketRef.current) {
          socketRef.current?.emit("answer", payload);
        }
      });
  } //Puede dar problemas

  function handleAnswer(message: any) {
    // Handle answer by the receiving peer
    if (message && peerRef.current) {
      const desc = new RTCSessionDescription(message.sdp); //PUEDE DAR PROBLEMAS
      peerRef.current
        .setRemoteDescription(desc)
        .catch((e: any) => console.log("Error handle answer", e));
    } else {
      console.log("Problems handling answer");
    }
  }

  function handleReceiveMessage(e: { data: any }) {
    //revisar
    // Listener for receiving messages from the peer
    console.log("[INFO] Message received from peer", e.data);
    const msg = [
      {
        _id: Math.floor(Math.random() * 1000).toString(),
        text: e.data,
        createdAt: new Date(),
        user: {
          _id: 2,
        },
      },
    ];
    setMessages(
      (previousMessages) =>
        GiftedChat.append(previousMessages, msg) as unknown as never
    ); //Revisar
  }

  function handleICECandidateEvent(e: any) {
    //ICE stands for Interactive Connectivity Establishment. Using this
    //peers exchange information over the internet. When establishing a
    //connection between the peers, peers generally look for several
    //ICE candidates and then decide which to choose best among possible
    //candidates

    if (e.candidate) {
      const payload = {
        target: otherUser.current,
        candidate: e.candidate,
      };
      socketRef.current?.emit("ice-candidate", payload);
    }
  }

  function handleNewICECandidateMsg(incoming: any) {
    console.log("HandlingnewIceCandidate");
    const candidate = new RTCIceCandidate(incoming);
    console.log("Ice candidate: " + candidate);
    peerRef.current
      .addIceCandidate(candidate)
      .catch((e: any) => console.log('Error:'+e));
  }

  function sendMessage(messages = []) {
    if (messages.length > 0) {
      console.log("Enviando mensaje");
      const { text } = messages[0];
      console.log('Texto'+text)
      sendChannel.current?.send(text);
      setMessages(
        (previousMessages) =>
          GiftedChat.append(previousMessages, messages) as unknown as never
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
    },
  
    textHeader: {
      fontFamily: "sans-serif",
      fontSize: 22,
      alignSelf: "center",
      marginTop: 20,
    },
    backgroundImage: {
      flex: 1,
      resizeMode: 'cover',
    },
  });

  return (
    <ImageBackground source={require('../../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => sendMessage(messages as never)}
        user={{
          _id: 1,
        }}
      />
    </ImageBackground>

  );
};

export default ChatB;
