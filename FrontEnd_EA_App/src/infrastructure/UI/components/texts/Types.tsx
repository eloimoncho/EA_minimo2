import { ReactNode } from 'react';
import { StyleProp, TextStyle, ViewStyle } from 'react-native';

export interface TextProps {
    children: ReactNode;
    style?: StyleProp<TextStyle>;
}

export type RootStackParamList = {
    Screen1: undefined;
    Screen2: { name: string };
  };
  