import React, {Component} from 'react';
import {
  StyleSheet,
  Switch,
  Button,
  View,
  Text,
  PermissionsAndroid,
} from 'react-native';
import MapView, {
  Marker,
  Polygon,
  Circle,
  JointTypes,
  MapTypes,
  PatternItemTypes,
} from '@hmscore/react-native-hms-map';
import mapStyleJson from './mapStyle.json';

let markerView;
let mapView;

const addMarker = (lat, lng) => {
  return (
    <Marker
      coordinate={{latitude: lat, longitude: lng}}
      title="Hello"
      snippet={
        'My lat: ' +
        parseFloat(lat).toFixed(3) +
        ' lon: ' +
        parseFloat(lng).toFixed(3)
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

const addCircle = (lat, lon) => {
  return (
    <Circle // Simple example
      center={{latitude: lat, longitude: lon}}
      radius={2000}
      strokeWidth={5}
      strokeColor={-256}
    />
  );
};
const drawPolygon = () => {
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
export default class App extends Component {
  constructor() {
    super();
    this.state = {
      markerLat: 41,
      markerLng: 29,
      mapZoom: 9,
      cameraZoom: 9,
      locationPermission: false,
      myLocationEnabled: false,
      darkModeOn: false,
    };
  }
  async requestPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('accessed location');
        this.setState({locationPermission: true});
      } else {
        this.setState({locationPermission: false});
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }
  render() {
    const {markerLat, markerLng, cameraZoom, mapZoom} = this.state;
    console.log('cameraZoom', cameraZoom);
    return (
      <View>
        <MapView
          style={{height: 700}}
          camera={{
            target: {latitude: markerLat, longitude: markerLng},
            zoom: mapZoom,
          }}
          myLocationEnabled={this.state.myLocationEnabled}
          myLocationButtonEnabled={true}
          useAnimation={true}
          animationDuration={2000}
          compassEnabled={true}
          mapStyle={this.state.darkModeOn ? JSON.stringify(mapStyleJson) : ''}
          mapType={MapTypes.NORMAL}
          rotateGesturesEnabled={true}
          scrollGesturesEnabled={true}
          tiltGesturesEnabled={true}
          zoomControlsEnabled={true}
          zoomGesturesEnabled={true}
          buildingsEnabled={true}
          description="Huawei Map"
          onCameraIdle={(e) => {
            console.log('MapView onCameraIdle, dsfdsf', e.nativeEvent);
            const cameraPosition = e.nativeEvent;
            console.log(
              'MapView onCameraIdle, zoom',
              parseFloat(cameraPosition.zoom.toFixed(2)),
            );
            this.setState({
              cameraZoom: parseFloat(cameraPosition.zoom.toFixed(2)),
            });
            console.log(
              'MapView onCameraIdle, lat',
              parseFloat(cameraPosition.target.latitude.toFixed(5)),
            );
            console.log(
              'MapView onCameraIdle, lng',
              parseFloat(cameraPosition.target.longitude.toFixed(5)),
            );
          }}
          onMapReady={(e) => console.log('MapView onMapReady', e.nativeEvent)}
          onCameraMoveCanceled={(e) =>
            console.log('MapView onCameraMoveCanceled')
          }
          onCameraMove={(e) => {
            console.log('MapView onCameraMove result', e.nativeEvent);
          }}
          onCameraMoveStarted={(e) =>
            console.log('MapView onCameraMoveStarted, result', e.nativeEvent)
          }
          onMapClick={(e) => {
            console.log('MapView was clicked', e.nativeEvent);
            const coordinate = e.nativeEvent.coordinate;
            this.setState({
              markerLat: coordinate.latitude,
              markerLng: coordinate.longitude,
              mapZoom: cameraZoom,
            });
          }}
          ref={(e) => {
            mapView = e;
          }}>
          {addMarker(markerLat, markerLng)}
          {addCircle(markerLat, markerLng)}
          {/* {drawPolygon()} */}
        </MapView>
        <View style={{flexDirection: 'row'}}>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text title="My Location">My Location</Text>
            <Switch
              onValueChange={() => {
                if (this.state.myLocationEnabled) {
                  this.setState({
                    myLocationEnabled: false,
                  });
                } else {
                  this.requestPermission();
                  this.setState({
                    myLocationEnabled: this.state.locationPermission,
                  });
                }
              }}
              value={this.state.myLocationEnabled}
            />
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Text title="Dark Mod">Dark Mode</Text>
            <Switch
              onValueChange={() =>
                this.setState({darkModeOn: !this.state.darkModeOn})
              }
              value={this.state.darkModeOn}
            />
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <Button
              title="Get Map Info"
              onPress={() => {
                mapView
                  .getHuaweiMapInfo()
                  .then((a) => console.log(a.visibleRegion))
                  .catch((a) => console.log(a));
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}
