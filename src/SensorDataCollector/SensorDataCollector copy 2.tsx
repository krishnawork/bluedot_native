import React, { useState, useEffect } from 'react';
import { View, Text, Button, PermissionsAndroid, Platform, ScrollView, Alert } from 'react-native';
import WifiManager from 'react-native-wifi-reborn';
import { accelerometer, gyroscope, magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

// ✅ Define Sensor Data Types
interface RotationEntry {
  timestamp: string;
  rotationData: { angle: number; x: number; y: number; z: number }[];
  magneticData: { x: number; y: number; z: number }[];
  movementData: { accX: number; accY: number; accZ: number }[];
  wifi: { ssid: string; rssi: number }[];
}

const SensorDataCollector: React.FC = () => {
  const [rotationData, setRotationData] = useState<{ angle: number; x: number; y: number; z: number }[]>([]);
  const [magneticData, setMagneticData] = useState<{ x: number; y: number; z: number }[]>([]);
  const [movementData, setMovementData] = useState<{ accX: number; accY: number; accZ: number }[]>([]);
  const [isRotating, setIsRotating] = useState(false);
  const [collectedData, setCollectedData] = useState<RotationEntry[]>([]);
  const [permissionsGranted, setPermissionsGranted] = useState(false);

  let currentAngle = 0;
  let lastAngle = 0;

  // ✅ Request Necessary Permissions Before Fetching Data
  const requestPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BODY_SENSORS
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] !== PermissionsAndroid.RESULTS.GRANTED ||
          granted[PermissionsAndroid.PERMISSIONS.BODY_SENSORS] !== PermissionsAndroid.RESULTS.GRANTED
        ) {
          Alert.alert("Permission Denied", "Location & Sensor permissions are required for data collection.");
          return false;
        }
      }
      setPermissionsGranted(true);
      return true;
    } catch (error) {
      console.error("Permission Error:", error);
      return false;
    }
  };

  // ✅ Function to Scan Nearby WiFi Networks
  const scanWiFiNetworks = async (): Promise<{ ssid: string; rssi: number }[]> => {
    try {
      if (!permissionsGranted) return [];
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

  // ✅ Function to Start Rotation Capture (with Magnetometer & Accelerometer)
  const startRotationCapture = async () => {
    if (!permissionsGranted) {
      Alert.alert("Permission Required", "Please allow location & sensor permissions to continue.");
      return;
    }

    setRotationData([]);
    setMagneticData([]);
    setMovementData([]);
    setIsRotating(true);
    lastAngle = 0;
    console.log("Rotation Started...");

    // ✅ Subscribe to Gyroscope
    const gyroSubscription = gyroscope.subscribe(({ x, y, z }) => {
      currentAngle += Math.abs(x) + Math.abs(y) + Math.abs(z);
      setRotationData((prev) => [...prev, { angle: currentAngle, x, y, z }]);

      // ✅ 360-degree complete hone par stop karein
      if (currentAngle - lastAngle >= 360) {
        stopRotationCapture(gyroSubscription, magSubscription, accSubscription);
      }
    });

    // ✅ Subscribe to Magnetometer
    const magSubscription = magnetometer.subscribe(({ x, y, z }) => {
      setMagneticData((prev) => [...prev, { x, y, z }]);
    });

    // ✅ Subscribe to Accelerometer
    const accSubscription = accelerometer.subscribe(({ x, y, z }) => {
      setMovementData((prev) => [...prev, { accX: x, accY: y, accZ: z }]);
    });
  };

  // ✅ Function to Stop Rotation Capture & Save Data
  const stopRotationCapture = async (
    gyroSubscription: any,
    magSubscription: any,
    accSubscription: any
  ) => {
    setIsRotating(false);
    console.log("Rotation Complete! Storing Data...");

    // ✅ Stop all subscriptions
    gyroSubscription.unsubscribe();
    magSubscription.unsubscribe();
    accSubscription.unsubscribe();

    // ✅ Scan WiFi Data
    const wifiData = await scanWiFiNetworks();

    // ✅ Create Final Object with All Data
    const newEntry: RotationEntry = {
      timestamp: new Date().toISOString(),
      rotationData,
      magneticData,
      movementData,
      wifi: wifiData,
    };

    setCollectedData((prevData) => [...prevData, newEntry]);
    setRotationData([]);
    setMagneticData([]);
    setMovementData([]);
    currentAngle = 0;
    lastAngle = 0;

    console.log("Stored Rotation Data:", newEntry);
  };

  // ✅ Check Permissions When App Starts
  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <ScrollView>
      <View style={{ padding: 20 }}>
        <Text>Rotation Mode: {isRotating ? "ACTIVE" : "INACTIVE"}</Text>
        <Text>{permissionsGranted ? "✅ Permissions Granted" : "❌ Permissions Not Granted"}</Text>

        {/* ✅ Button to Start/Stop Rotation Mode */}
        {!isRotating ? (
          <Button title="Start 360° Capture" onPress={startRotationCapture} />
        ) : (
          <Button title="Stop Capture" onPress={() => stopRotationCapture(null, null, null)} />
        )}

        {/* ✅ Display Collected Rotation Data */}
        {collectedData.map((data, index) => (
          <Text key={index} style={{ marginTop: 10 }}>
            📌 Time: {data.timestamp} {"\n"}
            🔄 Rotation Points: {data.rotationData.length} {"\n"}
            🧲 Magnetic Data Points: {data.magneticData.length} {"\n"}
            🏃 Accelerometer Data Points: {data.movementData.length} {"\n"}
            📡 WiFi Networks: {JSON.stringify(data.wifi)} {"\n"}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

export default SensorDataCollector;
