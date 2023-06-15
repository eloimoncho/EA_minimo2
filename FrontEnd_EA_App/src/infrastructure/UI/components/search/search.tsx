import React from 'react';
import { Alert, Share, View, Button } from 'react-native';

interface ShareComponentProps {
  url: string;
}

const ShareComponent: React.FC<ShareComponentProps> = ({ url }) => {
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: url,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con un tipo de actividad específico (puede agregar lógica adicional aquí si es necesario)
        } else {
          // Compartido exitosamente
        }
      } else if (result.action === Share.dismissedAction) {
        // Compartir cancelado por el usuario
      }
    } catch (error:any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ marginTop: 50 }}>
      <Button onPress={onShare} title="Compartir" />
    </View>
  );
};

export default ShareComponent;
