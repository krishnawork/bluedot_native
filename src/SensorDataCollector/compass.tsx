import React from "react";
import { Text, View, Image, Dimensions, StyleSheet } from "react-native";
import LPF from "lpf";
import { magnetometerSignal } from "../store/sensorStore"; // ✅ Importing magnetometer signal
import { computed } from "@preact/signals-react";
const { height, width } = Dimensions.get("window");

const Compass = ({ height = 200 }) => {

  // Low-Pass Filter (LPF) Initialization
  LPF.init([]);
  LPF.smoothing = 0.2;




  const calculateAngle = (magnetometer: any) => {
    let angle = 0;
    if (magnetometer) {
      const { x, y } = magnetometer;
      angle = Math.atan2(y, x) * (180 / Math.PI);
      if (angle < 0) angle += 360;
    }
    return Math.round(LPF.next(angle));
  };

  const getDirection = (degree: number) => {
    if (degree >= 22.5 && degree < 67.5) return "NE";
    if (degree >= 67.5 && degree < 112.5) return "E";
    if (degree >= 112.5 && degree < 157.5) return "SE";
    if (degree >= 157.5 && degree < 202.5) return "S";
    if (degree >= 202.5 && degree < 247.5) return "SW";
    if (degree >= 247.5 && degree < 292.5) return "W";
    if (degree >= 292.5 && degree < 337.5) return "NW";
    return "N";
  };

  const adjustedDegree = (degree: number) => (degree - 90 >= 0 ? degree - 90 : degree + 271);


  let CompassShow = computed(()=>{
    let magnetometerData = calculateAngle(magnetometerSignal.value)
    return (
      <View style={[styles.container, { height, width: height }]}>
      {/* Direction Text (Small & Positioned Correctly) */}
      <View style={styles.directionContainer}>
        <Text style={[styles.directionText, { fontSize: height / 15 }]}>
          {getDirection(adjustedDegree(magnetometerData))}
        </Text>
      </View>

      {/* Pointer Image */}
      <View style={styles.pointerContainer}>
        <Image source={require("./assets/compass_pointer.png")} style={[styles.pointer, { height: height / 12 }]} />
      </View>

      {/* Degree Text */}
      <Text style={[styles.degreeText, { fontSize: height / 10 }]}>
        {adjustedDegree(magnetometerData)}°
      </Text>

      {/* Compass Image */}
      <View style={styles.compassContainer}>
        <Image
          source={require("./assets/compass_bg.png")}
          style={[
            styles.compass,
            {
              height: height - 40,
              transform: [{ rotate: 360 - magnetometerData + "deg" }],
            },
          ]}
        />
      </View>
    </View>
    )
  })

  return (
    CompassShow
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  directionContainer: {
    position: "absolute",
    zIndex: 2, // **Ensure it Stays on Top**
    backgroundColor: "rgba(0, 0, 0, 0.5)", // **Better Visibility**
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
    top: "40%",
    left:'45%'
  },
  directionText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  pointerContainer: {
    alignItems: "center",
    marginBottom: 5,
  },
  pointer: {
    resizeMode: "contain",
  },
  degreeText: {
    color: "#fff",
    textAlign: "center",
    position: "absolute",
    top: "55%",
    left:'45%'
  },
  compassContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  compass: {
    resizeMode: "contain",
  },
});

export default React.memo(Compass);

