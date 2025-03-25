import { computed, signal } from "@preact/signals-react";
import { ScrollView, View } from "react-native";
import { Text } from "react-native-svg";

// ✅ Define signals for each sensor
export const magnetometerSignal = signal({ x: 0, y: 0, z: 0 });
export const accelerometerSignal = signal({ x: 0, y: 0, z: 0 });
export const gyroscopeSignal = signal({ x: 0, y: 0, z: 0 });

// ✅ Function to update signals
export const updateSensorData = (type: "magnetometer" | "accelerometer" | "gyroscope", data: any) => {
  if (type === "magnetometer") magnetometerSignal.value = data;
  if (type === "accelerometer") accelerometerSignal.value = data;
  if (type === "gyroscope") gyroscopeSignal.value = data;
};


