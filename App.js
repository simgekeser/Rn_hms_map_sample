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
import AddMarker from './src/components/AddMarker';
import AddCircle from './src/components/AddCircle';
import AddPolygon from './src/components/AddPolygon';
import DrawRoute from './src/components/DrawRoute';

let mapView;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      markerLat: 39.91319446533336,
      markerLng: 32.87366542685692,
      mapZoom: 13,
      cameraZoom: 13,
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
            // console.log('MapView onCameraIdle, dsfdsf', e.nativeEvent);
            const cameraPosition = e.nativeEvent;
            // console.log(
            //   'MapView onCameraIdle, zoom',
            //   parseFloat(cameraPosition.zoom.toFixed(2)),
            // );
            this.setState({
              cameraZoom: parseFloat(cameraPosition.zoom.toFixed(2)),
            });
            // console.log(
            //   'MapView onCameraIdle, lat',
            //   parseFloat(cameraPosition.target.latitude.toFixed(5)),
            // );
            // console.log(
            //   'MapView onCameraIdle, lng',
            //   parseFloat(cameraPosition.target.longitude.toFixed(5)),
            // );
          }}
          onMapReady={(e) => console.log('MapView onMapReady', e.nativeEvent)}
          onCameraMoveCanceled={
            (e) => {}
            //     console.log('MapView onCameraMoveCanceled')
          }
          onCameraMove={(e) => {
            //    console.log('MapView onCameraMove result', e.nativeEvent);
          }}
          onCameraMoveStarted={
            (e) => {}
            //  console.log('MapView onCameraMoveStarted, result', e.nativeEvent)
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
          <DrawRoute />

          {/* <AddMarker latitude={markerLat} longitude={markerLng} /> */}
          {/* <AddCircle lat={markerLat} lng={markerLng} />
          <AddPolygon /> */}
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
