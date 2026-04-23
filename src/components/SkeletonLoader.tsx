import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius } from '../constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 16,
  borderRadius = BorderRadius.sm,
  style,
}) => {
  return (
    <View
      style={[
        styles.skeleton,
        { width: width as any, height, borderRadius },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Colors.border,
    opacity: 0.6,
  },
});
