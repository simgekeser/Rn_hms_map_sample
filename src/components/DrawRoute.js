import React, {useEffect, useState} from 'react';
import {
  Polyline,
  PatternItemTypes,
  JointTypes,
  CapTypes,
} from '@hmscore/react-native-hms-map';

export default function DrawRoute() {
  const [steps, setSteps] = useState([]);
  let mPolyline = [];
  let mPoint = [];

  useEffect(() => {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        key:
          'CgB6e3x98UWfwDrNky2lDu4GImg6Y5JXOcuZ06//5guXeVdcWTvxoT8HUM3gQ42t1yic/p6munAFwNyrHo+E6YxB',
      },
      body: JSON.stringify({
        origin: {
          lng: 32.87366542685692,
          lat: 39.91319446533336,
        },
        destination: {
          lng: 32.86064633915178,
          lat: 39.902029117096085,
        },
      }),
    };
    fetch(
      'https://mapapi.cloud.huawei.com/mapApi/v1/routeService/walking?key=',
      requestOptions,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('data', data.routes[0].paths[0].steps);
        setSteps(data.routes[0].paths[0].steps);
      });
  }, []);

  steps.map((steps) => {
    mPolyline.push(steps.polyline);
  });
  mPolyline.map((point) => {
    if (point.length > 1) {
      point.map((arr) => {
        mPoint.push({latitude: arr.lat, longitude: arr.lng});
      });
    }
  });
  console.log('====================================');
  console.log('points', mPoint);
  console.log('====================================');
  return (
    <Polyline
      points={mPoint}
      clickable={true}
      geodesic={true}
      color={-1879018753}
      jointType={JointTypes.BEVEL}
      pattern={[{type: PatternItemTypes.DASH, length: 20}]}
      startCap={{
        type: CapTypes.ROUND,
      }}
      endCap={{
        type: CapTypes.CUSTOM,
        refWidth: 1000,
        asset: 'ic_launcher.png', // under assets folder
      }}
      visible={true}
      width={9.0}
      zIndex={2}
      onClick={(e) => console.log('Polyline onClick')}
    />
  );
}
