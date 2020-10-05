import React from 'react';
import {Marker} from '@hmscore/react-native-hms-map';

const AddMarker = ({latitude, longitude}) => {
  return (
    <Marker
      coordinate={{latitude: latitude, longitude: longitude}}
      title="Hello"
      snippet={
        'My lat: ' +
        parseFloat(latitude).toFixed(3) +
        ' lon: ' +
        parseFloat(longitude).toFixed(3)
      }
      draggable={true}
      flat={true}
      icon={{
        asset: 'ic_launcher.png', // under assets folder
      }}
      markerAnchor={[0.5, 0.5]}
      infoWindowAnchor={[0.5, 0.5]}
      visible={true}
      zIndex={3}
      clusterable={false}
      onClick={(e) => {
        console.log('Marker onClick');
      }}
      onDragStart={(e) => console.log('Marker onDragStart', e.nativeEvent)}
      onDrag={(e) => {
        console.log('Marker onDrag', e.nativeEvent);
      }}
      onDragEnd={(e) =>
        console.log('Marker onDragEnd', e.nativeEvent.coordinate)
      }
      onInfoWindowClick={(e) => console.log('Marker onInfoWindowClick')}
      onInfoWindowClose={(e) => console.log('Marker onInfoWindowClose')}
      onInfoWindowLongClick={(e) => console.log('Marker onInfoWindowLongClick')}
      ref={(e) => {
        markerView = e;
      }}
    />
  );
};
export default AddMarker;
