import React from 'react'
import { View,  TouchableOpacity, Text } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { GestureHandlerRootView, Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useSharedValue,  withTiming } from "react-native-reanimated";
import { imageDimensions, mapImage } from '../store/gridSignal';
import GridCanvas from '../Gridview/GridCanvas';
import { Skia } from '@shopify/react-native-skia';
import { useSignals } from '@preact/signals-react/runtime';


// 🔹 Function to Convert Image URI to Skia Image
const loadImage = async (uri: string) => {
    try {
      const response = await fetch(uri);
      const buffer = await response.arrayBuffer();
      const skData = Skia.Data.fromBytes(new Uint8Array(buffer)); // ✅ Convert ArrayBuffer to SkData
      const skImage = Skia.Image.MakeImageFromEncoded(skData);
      if (skImage) {
        mapImage.value = skImage;
      } else {
        console.error("Image conversion failed");
      }
    } catch (error) {
      console.error("Failed to load image:", error);
    }
  };

const MapView = () => {
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
  
    const pinchGesture = Gesture.Pinch()
      .onUpdate((event) => {
        scale.value = withTiming(event.scale);
      });
  
    const panGesture = Gesture.Pan()
      .onUpdate((event) => {
        translateX.value = withTiming(event.translationX);
        translateY.value = withTiming(event.translationY);
      });
  
      const handleImagePick = () => {
        launchImageLibrary({ mediaType: "photo" }, async (response) => {
          if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri!;
            imageDimensions.value = { width: response.assets[0].width || 500, height: response.assets[0].height || 500 };
            await loadImage(uri); // Convert URI to SkImage
          }
        });
      };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: "#222" }}>
      <TouchableOpacity onPress={handleImagePick} style={{ padding: 10, backgroundColor: "blue", marginBottom: 10 }}>
        <Text style={{ color: "white", textAlign: "center" }}>Select Map Image</Text>
      </TouchableOpacity>

      {/* Gesture Handling - Fix Applied */}
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.View style={{ flex: 1 }}>
          <GridCanvas scale={scale} translateX={translateX} translateY={translateY} />
        </Animated.View>
      </GestureDetector>
    </View>
  </GestureHandlerRootView>
  )
}

export default MapView