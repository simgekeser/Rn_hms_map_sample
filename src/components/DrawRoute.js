import React, {useEffect, useState} from 'react';
import {
  Polyline,
  PatternItemTypes,
  JointTypes,
  CapTypes,
} from '@hmscore/react-native-hms-map';

export default function DrawRoute({latitude, longitude}) {
  const [steps, setSteps] = useState([]);
  let mPolylines = [];
  let mPoints = [];

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
          lng: longitude,
          lat: latitude,
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
        console.log('data steps', data.routes[0].paths[0].steps);
        setSteps(data.routes[0].paths[0].steps);
      });
  }, []);

  steps.map((steps) => {
    mPolylines.push(steps.polyline);
  });
  console.log('mPolylines', mPolylines);

  mPolylines.map((point) => {
    point.map((arr) => {
      mPoints.push({latitude: arr.lat, longitude: arr.lng});
    });
  });
  console.log('mPoints', mPoints);
  return (
    <Polyline
      points={mPoints}
      clickable={true}
      geodesic={true}
      color={-49151}
      jointType={JointTypes.BEVEL}
      pattern={[{type: PatternItemTypes.DASH, length: 20}]}
      startCap={{
        type: CapTypes.ROUND,
      }}
      endCap={{
        type: CapTypes.ROUND,
      }}
      visible={true}
      width={6.0}
      zIndex={2}
      onClick={(e) => console.log('Polyline onClick')}
    />
  );
}
