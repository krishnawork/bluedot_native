
import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, ScrollView, Alert } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { accelerometer, gyroscope, magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { SensorStyles as Style } from './sensorDataStyle';
import { MagneticData, ModeType, MovementData, SensorEntry, WiFiData } from '../types/sensorDataCollectorType';
import GridView from '../Gridview/GridView';
import { renderGrid } from '../store/gridSignal';

const SensorDataCollector: React.FC = () => {
    const [sensorData, setSensorData] = useState<SensorEntry[]>([]);
  const [mode, setMode] = useState<ModeType>('static');

  // ✅ Request Location Permissions for WiFi
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Required", "Please enable location permissions for WiFi scanning.");
        return false;
      }
    }
    return true;
  };

  // ✅ Function to Scan Nearby WiFi Networks
  const scanWiFiNetworks = async (): Promise<WiFiData[]> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return [];

      const wifiList = await WifiManager.loadWifiList();
      console.log('wifiList: ', wifiList);

      return wifiList.map((network) => ({
        ssid: network.SSID,
        rssi: network.level,
      }));
    } catch (error) {
      console.error("Error scanning WiFi networks:", error);
      return [];
    }
  };

  // ✅ Function to Collect All Data
  const collectAllData = async (currentMode: ModeType): Promise<void> => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // ✅ 1. Collect WiFi Scan Data (All Networks)
      const wifiData: WiFiData[] = await scanWiFiNetworks();

      // ✅ 2. Collect Magnetic Field Data
      const magnetometerData: MagneticData = await new Promise((resolve) => {
        const subscription = magnetometer.subscribe(({ x, y, z }) => {
          resolve({ x, y, z });
          subscription.unsubscribe();
        });
      });

      // ✅ 3. Collect Accelerometer Data
      const accelerometerData: MovementData = await new Promise((resolve) => {
        const subscription = accelerometer.subscribe(({ x, y, z }) => {
          resolve({ accX: x, accY: y, accZ: z, gyroX: 0, gyroY: 0, gyroZ: 0 });
          subscription.unsubscribe();
        });
      });

      // ✅ 4. Collect Gyroscope Data
      const gyroscopeData: { gyroX: number; gyroY: number; gyroZ: number } = await new Promise((resolve) => {
        const subscription = gyroscope.subscribe(({ x, y, z }) => {
          resolve({ gyroX: x, gyroY: y, gyroZ: z });
          subscription.unsubscribe();
        });
      });

      // ✅ 5. Store Data in JSON Format
      const newEntry: SensorEntry = {
        timestamp: new Date().toISOString(),
        wifi: wifiData,
        magnetic: magnetometerData,
        movement: { ...accelerometerData, ...gyroscopeData },
        mode: currentMode,
      };

      // ✅ 6. Store & Display Data
      setSensorData((prevData) => [...prevData, newEntry]);
      console.log('Collected Data:', newEntry);
    } catch (error) {
      console.error('Error collecting sensor data:', error);
    }
  };

  // ✅ Auto Mode Data Collection Every 3 Sec
  useEffect(() => {
    // ✅ Set Sensor Update Intervals
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000); // Every 1 sec
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
    setUpdateIntervalForType(SensorTypes.gyroscope, 1000);

    const interval = setInterval(() => {
      if (mode !== 'static') {
        collectAllData(mode);
      }
    }, 3000); // Har 3 sec me data collect karega

    return () => clearInterval(interval);
  }, [mode]);
    return (
      <>
        <View style={Style.container}>
            <ScrollView>
                <Text>Current Mode: {mode.toUpperCase()}</Text>

                {/* ✅ Mode Selection Buttons */}
                <Button title="Static Mode" onPress={() => setMode('static')} />
                <Button title="Walking Mode (Auto)" onPress={() => setMode('walking')} />
                <Button title="Rotation Mode (Auto)" onPress={() => setMode('rotation')} />

                {/* ✅ Button to Collect Data Manually */}
                <Button title="Collect Data Now" onPress={() => collectAllData(mode)} />

                {/* ✅ Display Collected Data */}
                {/* {sensorData.map((data, index) => (
                    <Text key={index} style={{ marginTop: 10 }}>
                        📌 Time: {data.timestamp} {'\n'}
                        📡 WiFi: {data.wifi.ssid} (RSSI: {data.wifi.rssi}) {'\n'}
                        🧲 Magnetic: X: {data.magnetic.x}, Y: {data.magnetic.y}, Z: {data.magnetic.z} {'\n'}
                        🏃 Accelerometer: X: {data.movement.accX}, Y: {data.movement.accY}, Z: {data.movement.accZ} {'\n'}
                        🔄 Gyroscope: X: {data.movement.gyroX}, Y: {data.movement.gyroY}, Z: {data.movement.gyroZ} {'\n'}
                        🚀 Mode: {data.mode.toUpperCase()}
                    </Text>
                ))} */}
                 {sensorData.map((data, index) => (
                     <Text key={index} style={{ marginTop: 10 }}>
                         📌 Time: {data.timestamp} {'\n'}
                         📡 WiFi Networks: {JSON.stringify(data.wifi)} {'\n'}
                         🧲 Magnetic: X: {data.magnetic.x}, Y: {data.magnetic.y}, Z: {data.magnetic.z} {'\n'}
                         🏃 Accelerometer: X: {data.movement.accX}, Y: {data.movement.accY}, Z: {data.movement.accZ} {'\n'}
                         🔄 Gyroscope: X: {data.movement.gyroX}, Y: {data.movement.gyroY}, Z: {data.movement.gyroZ} {'\n'}
                         🚀 Mode: {data.mode.toUpperCase()}
                     </Text>
        ))}

            </ScrollView>

        </View>

       {renderGrid}

        </>
    );
};

export default SensorDataCollector;
