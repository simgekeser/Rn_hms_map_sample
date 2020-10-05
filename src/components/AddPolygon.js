import React from 'react';
import {
  Polygon,
  JointTypes,
  PatternItemTypes,
} from '@hmscore/react-native-hms-map';

const AddPolygon = () => {
  console.log('====================================');
  console.log('Drawing polygon');
  console.log('====================================');
  return (
    <Polygon // Complex example
      points={[
        {latitude: 41.1, longitude: 29.2},
        {latitude: 40.9, longitude: 29.2},
        {latitude: 40.9, longitude: 28.8},
        {latitude: 41.1, longitude: 28.8},
      ]}
      clickable={true}
      geodesic={true}
      fillColor={538066306} // very transparent blue(0x20123D82)
      strokeColor={-256} // yellow(0xFFFFFF00)
      strokeJointType={JointTypes.BEVEL}
      strokePattern={[
        {type: PatternItemTypes.DASH, length: 20},
        {type: PatternItemTypes.DOT},
        {type: PatternItemTypes.GAP, length: 20},
      ]}
      zIndex={2}
      onClick={(e) => console.log('Polygon onClick')}
    />
  );
};
export default AddPolygon;
