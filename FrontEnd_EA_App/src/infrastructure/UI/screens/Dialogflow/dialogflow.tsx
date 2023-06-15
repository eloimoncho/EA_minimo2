import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Dialogflow_V2 } from 'react-native-dialogflow';
import Voice from '@react-native-community/voice';
import { GoogleSignin } from 'react-native-google-signin';

/*const dialogflowConfig = {
  clientId: '10555416937782666461',
  language: 'es',
  projectId: 'eaproject-389519',
  privateKey: 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2Qx0kt5wSTiXu\nn0ptXJWyVx7S1vKQuk+8MoSXKOZ4Y4db9U0YYyk3zX+F94HQtlH90JEKjFCl9k7V\nfmPMPdLattYRI+J3sd2GGy/+eBTxQfAMMXZbbKhrwy/Wn3Lyh0WYkUagMlYuCuTw\nbYNqELQmujH2+VfYETvQEDOzjb6d87vGRgm8EKxCBpeObEFLUZUGxD/gRFP52mz2\nepYESToImB+cfh9nn9ZUntVYN6As3rrR7jFc/g5bc43nf10aMEXlYCc6qDMlISvd\nrjsqsqr8qP4Bn2UmeHUsUuOiz7RBJnIDrNCD47X3udZMOAZAWIkHXTQc2VxkK6v/\nnSytgtOXAgMBAAECggEAOHpLiZkrz7BPqMXLdl/+Mykz7/mTaK2TD6pH099kq2GM\nDD7TCP+RQi13mre7jkUw2wnKKA6a3xKYEyf7HMr7j7KgWudXwedn0aqTELN9KdVY\n4S5ikqn09o+hP0xhfi3UrxY1YGa4tcPCdY457qAGcwm3eeSCB/4vHqYmnzkJHEBo\nrbvAgiSjzHB6iPzYNZqTOEH0n0iiLZBboOGlzjavGy9tEfVKiRefTSK9drXVAX7m\nK0RO1jkJqta3eSPUmTXCpBmDWh4/qL77fcl/AeA9ZT048iHijqJW+LwzKQeuVa4M\n8wiKSs3gM0eo/qMs3ke3TyrH85LSHNYkK/imsiN6wQKBgQDhWwwNdutDTlSwJ4mc\nw+eOCmthwq1MHh3Warzo2SohsOlUAJati6YSDoa6tyJUDAccIsoeLIdg4xKKTvpA\nC49gf24bru+YAHplTb0QIkrixP8Zeer0DMVG8RmO3JR/lv/dv36SMYEdsuqzhVxP\nCclftPle13L37zTKEO18buz2iQKBgQDPC+uzLr5ezZ8oyFyaHGFk/WQmwpw0tSF4\nbWuag3UM7FmGqaPSFnCPOAAR1lbZ+l7PNvNW4Eq1sNkxyRYo8afbPVpG/+1Tmtx5\nQN2YAYHCZmxzCPR4jngqNYlawlz/WZGyJ16771nvPBZuYg9BNC6Uli7mSNggY7di\n/WZJ5mrxHwKBgEAmiufKUm52feUnXCUkH2Zv0OGjaXGhoRzIhb5DE5tDoSgogrwk\nZMH/IJtGRp9mTR/VR3QPePo7qat1kAdrQwVVQSLgSZQbjrwHxSoymN609WlrK1cN\ny5rGR2BDqoInme6l9IHpVbf+lpFEBWL6hjiYa+RzsGaj0YM0Dma9rPcBAoGAG5B1\nt6wwcgSj/NT35xiCKuTFMZfVHftDUnoWykJYEflhTdlF0xFjuN12vOkxNOHtP18M\ndHN13syFjeg8iATsGPcJDszBttC2K3pkRfllYhEqvQHjMi2dd9kayTd5FBHDoNk2\n9oQ+D+iK//UUHNUqomOAKO5nv6Am6QndVVdUw3cCgYB37d6prnx8Bdr+pyWLZ70b\n+zICvr12QkEoUzZCR8xeSQQfdJU9QbcdbAZye9MQzheFkKiR4dhVKsfQIRl3HW7M\n39V5MK5aFc9MusxLs8dl7UJ6V6mvQEFzI+Et0nPt3UX4T6gtTIpNUEJGRCyTjvWY\nOhJneebVzV+6VWOHbJ+Dsw==',
  clientEmail: 'dialogflow@eaproject-389519.iam.gserviceaccount.com'
};*/
Dialogflow_V2.setConfiguration('dialogflow@eaproject-389519.iam.gserviceaccount.com','MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC2Qx0kt5wSTiXu\nn0ptXJWyVx7S1vKQuk+8MoSXKOZ4Y4db9U0YYyk3zX+F94HQtlH90JEKjFCl9k7V\nfmPMPdLattYRI+J3sd2GGy/+eBTxQfAMMXZbbKhrwy/Wn3Lyh0WYkUagMlYuCuTw\nbYNqELQmujH2+VfYETvQEDOzjb6d87vGRgm8EKxCBpeObEFLUZUGxD/gRFP52mz2\nepYESToImB+cfh9nn9ZUntVYN6As3rrR7jFc/g5bc43nf10aMEXlYCc6qDMlISvd\nrjsqsqr8qP4Bn2UmeHUsUuOiz7RBJnIDrNCD47X3udZMOAZAWIkHXTQc2VxkK6v/\nnSytgtOXAgMBAAECggEAOHpLiZkrz7BPqMXLdl/+Mykz7/mTaK2TD6pH099kq2GM\nDD7TCP+RQi13mre7jkUw2wnKKA6a3xKYEyf7HMr7j7KgWudXwedn0aqTELN9KdVY\n4S5ikqn09o+hP0xhfi3UrxY1YGa4tcPCdY457qAGcwm3eeSCB/4vHqYmnzkJHEBo\nrbvAgiSjzHB6iPzYNZqTOEH0n0iiLZBboOGlzjavGy9tEfVKiRefTSK9drXVAX7m\nK0RO1jkJqta3eSPUmTXCpBmDWh4/qL77fcl/AeA9ZT048iHijqJW+LwzKQeuVa4M\n8wiKSs3gM0eo/qMs3ke3TyrH85LSHNYkK/imsiN6wQKBgQDhWwwNdutDTlSwJ4mc\nw+eOCmthwq1MHh3Warzo2SohsOlUAJati6YSDoa6tyJUDAccIsoeLIdg4xKKTvpA\nC49gf24bru+YAHplTb0QIkrixP8Zeer0DMVG8RmO3JR/lv/dv36SMYEdsuqzhVxP\nCclftPle13L37zTKEO18buz2iQKBgQDPC+uzLr5ezZ8oyFyaHGFk/WQmwpw0tSF4\nbWuag3UM7FmGqaPSFnCPOAAR1lbZ+l7PNvNW4Eq1sNkxyRYo8afbPVpG/+1Tmtx5\nQN2YAYHCZmxzCPR4jngqNYlawlz/WZGyJ16771nvPBZuYg9BNC6Uli7mSNggY7di\n/WZJ5mrxHwKBgEAmiufKUm52feUnXCUkH2Zv0OGjaXGhoRzIhb5DE5tDoSgogrwk\nZMH/IJtGRp9mTR/VR3QPePo7qat1kAdrQwVVQSLgSZQbjrwHxSoymN609WlrK1cN\ny5rGR2BDqoInme6l9IHpVbf+lpFEBWL6hjiYa+RzsGaj0YM0Dma9rPcBAoGAG5B1\nt6wwcgSj/NT35xiCKuTFMZfVHftDUnoWykJYEflhTdlF0xFjuN12vOkxNOHtP18M\ndHN13syFjeg8iATsGPcJDszBttC2K3pkRfllYhEqvQHjMi2dd9kayTd5FBHDoNk2\n9oQ+D+iK//UUHNUqomOAKO5nv6Am6QndVVdUw3cCgYB37d6prnx8Bdr+pyWLZ70b\n+zICvr12QkEoUzZCR8xeSQQfdJU9QbcdbAZye9MQzheFkKiR4dhVKsfQIRl3HW7M\n39V5MK5aFc9MusxLs8dl7UJ6V6mvQEFzI+Et0nPt3UX4T6gtTIpNUEJGRCyTjvWY\nOhJneebVzV+6VWOHbJ+Dsw==','es','eaproject-389519');
const ChatbotScreen = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputText, setInputText] = useState<string>('');

  useEffect(() => {
    GoogleSignin.configure({
      // Configurar las credenciales de Google Sign-In si es necesario
    });

    Voice.onSpeechStart = handleVoiceStart;
    Voice.onSpeechEnd = handleVoiceEnd;
    Voice.onSpeechResults = handleVoiceResults;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const handleVoiceStart = () => {
    Voice.start('es');
  };

  const handleVoiceEnd = () => {
    Voice.stop();
  };

  const handleVoiceResults = (event: any) => {
    const speech = event.value[0];

    Dialogflow_V2.requestQuery(
      speech,
      (result: any) => {
        const response = result.queryResult.fulfillmentText;
        addMessage(response);
      },
      (error: any) => {
        console.log(error);
      }
    );
  };

  const addMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleTextInputChange = (text: string) => {
    setInputText(text);
  };

  const handleSendMessage = () => {
    if (inputText) {
      addMessage(inputText);
      Dialogflow_V2.requestQuery(
        inputText,
        (result: any) => {
          const response = result.queryResult.fulfillmentText;
          addMessage(response);
        },
        (error: any) => {
          console.log(error);
        }
      );
      setInputText('');
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={{ flex: 1, marginBottom: 16 }}>
        {messages.map((message, index) => (
          <Text key={index}>{message}</Text>
        ))}
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={{ flex: 1, marginRight: 8, padding: 8, borderWidth: 1, borderColor: '#ccc' }}
          value={inputText}
          onChangeText={handleTextInputChange}
          placeholder="Escribe tu mensaje..."
        />
        <TouchableOpacity onPress={handleSendMessage} style={{ padding: 8, backgroundColor: 'blue' }}>
          <Text style={{ color: 'white' }}>Enviar</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleVoiceStart} style={{ marginTop: 16, padding: 8, backgroundColor: 'green' }}>
        <Text style={{ color: 'white' }}>Hablar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChatbotScreen;
