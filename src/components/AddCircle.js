import React from 'react';
import {Circle} from '@hmscore/react-native-hms-map';

const AddCircle = ({lat, lng}) => {
  return (
    <Circle // Simple example
      center={{latitude: lat, longitude: lng}}
      radius={2000}
      strokeWidth={5}
      strokeColor={-256}
    />
  );
};
export default AddCircle;
