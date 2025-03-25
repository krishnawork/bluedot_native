import { magnetometer, accelerometer, gyroscope, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { PermissionsAndroid, Platform, Alert } from "react-native";
import { updateSensorData } from "../store/sensorStore"; // ✅ Import signals updater

class SensorManager {
  private subscriptions: any[] = [];

  constructor() {
    // ✅ Set update intervals
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
    setUpdateIntervalForType(SensorTypes.gyroscope, 1000);
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission Required",
            message: "This app needs location permission to access sensors",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert("Permission Denied", "You need to grant location permission to use sensors.");
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS does not require explicit permissions
  }

  async startListening() {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) return;

    const magSubscription = magnetometer.subscribe(({ x, y, z }) => {
      updateSensorData("magnetometer", { x, y, z }); // ✅ Update Signal
    });

    const accSubscription = accelerometer.subscribe(({ x, y, z }) => {
      updateSensorData("accelerometer", { x, y, z }); // ✅ Update Signal
    });

    const gyroSubscription = gyroscope.subscribe(({ x, y, z }) => {
      updateSensorData("gyroscope", { x, y, z }); // ✅ Update Signal
    });

    this.subscriptions = [magSubscription, accSubscription, gyroSubscription];
  }

  stopListening() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
  }
}

export default new SensorManager();
