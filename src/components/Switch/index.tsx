import React, { useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, TouchableOpacity, View } from
  'react-native';

type TProps = {
  value: boolean | undefined;
  onChange: () => void;
  onColor?: string;
  offColor?: string;
  label?: string;
  labelStyle?: any;
};

const Switch: React.FC<TProps> = ({
  value,
  onChange,
  onColor = '#3FFFA3',
  offColor = '#FF3F4B',
  label = '',
  labelStyle,
}) => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    value && setIsEnabled(value);
  }, [value]);

  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
    onChange();
  };

  const animatedValue = new Animated.Value(0);

  const moveToggle = animatedValue.interpolate({
    inputRange: [-0.2, 0.9],
    outputRange: [0, 20],
  });

  const color = value ? onColor : offColor;

  animatedValue.setValue(!value ? 0 : 1);

  Animated.timing(animatedValue, {
    toValue: value ? 1 : 0,
    duration: 100000,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

  return (
    <View style={styles.container}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}
      </Text>}

      <TouchableOpacity onPress={toggleSwitch} activeOpacity={1}>
        <View style={[styles.toggleContainer, {
          backgroundColor:
            color
        }]}>
          {
            !value && (
              <Animated.View style={[styles.toggleWheelStyleFalse,
              { marginLeft: moveToggle }]} />
            ) || (
              <Animated.View style={[styles.toggleWheelStyleTrue,
              { marginLeft: moveToggle }]} />
            )
          }
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Switch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  toggleContainer: {
    width: 50,
    height: 30,
    marginLeft: 3,
    borderRadius: 15,
    justifyContent: 'center',
  },

  label: {
    marginRight: 2,
  },

  toggleWheelStyleFalse: {
    width: 25,
    height: 25,
    backgroundColor: '#760f16',
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },

  toggleWheelStyleTrue: {
    width: 25,
    height: 25,
    backgroundColor: '#0a5b34',
    borderRadius: 12.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 1.5,
  },

});