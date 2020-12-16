import React, {Component} from 'react';
import {Switch, Button, View, Text, PermissionsAndroid} from 'react-native';
import MapView, {MapTypes} from '@hmscore/react-native-hms-map';
import HMSLocation from '@hmscore/react-native-hms-location';

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
      markerLat: 0,
      markerLng: 0,
      mapZoom: 20,
      cameraZoom: 20,
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
  componentDidMount() {
    console.log('====================================');
    console.log('Hiiii location');
    console.log('====================================');
    HMSLocation.FusedLocation.Native.getLastLocation()
      .then((pos) => {
        console.log('posLocatin', pos);
        this.setState({markerLat: pos.latitude, markerLng: pos.longitude});
      })
      .catch((err) => console.log('Failed to get last location', err));
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

            mapView
                  .getHuaweiMapInfo()
                  .then((a) => console.log(a))
                  .catch((a) => console.log(a));
            const cameraPosition = e.nativeEvent;
         
            this.setState({
              cameraZoom: parseFloat(cameraPosition.zoom.toFixed(2)),
            });
           
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
          <AddMarker latitude={markerLat} longitude={markerLng} />
          {(markerLat !== 0) & (markerLng !== 0) ? (
            <DrawRoute latitude={markerLat} longitude={markerLng} />
          ) : null}

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
                }
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
