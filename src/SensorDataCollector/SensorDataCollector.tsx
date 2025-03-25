import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import SensorManager from '../utils/sensorManager';
import { magnetometerSignal, accelerometerSignal, gyroscopeSignal } from "../store/sensorStore";
import { SensorStyles as Style } from './sensorDataStyle';
import { computed } from "@preact/signals-react";
import Compass from './compass';
import MapView from '../mapview/MapView';

const SensorDataCollector: React.FC = () => {
  useEffect(() => {
    SensorManager.startListening();
    return () => SensorManager.stopListening();
  }, []);

  let ShowSensorData = computed(() => {
    return (
      <View style={{ height: 150 }}>
        <Text>🧲 Magnetic: X: {magnetometerSignal.value.x}, Y: {magnetometerSignal.value.y}, Z: {magnetometerSignal.value.z}</Text>
        <Text>🏃 Accelerometer: X: {accelerometerSignal.value.x}, Y: {accelerometerSignal.value.y}, Z: {accelerometerSignal.value.z}</Text>
        <Text>🔄 Gyroscope: X: {gyroscopeSignal.value.x}, Y: {gyroscopeSignal.value.y}, Z: {gyroscopeSignal.value.z}</Text>
      </View>
    )
  })

  return (
    <>
      <ScrollView>
        <View style={Style.container} >
          {ShowSensorData}
          {/* compass */}
          <View style={{ height: 100, backgroundColor: 'black' }}>
            <Compass height={100} />
          </View>
          {/* image and grid */}
          <MapView />
        </View>
      </ScrollView>

    </>
  );
};

export default SensorDataCollector;
