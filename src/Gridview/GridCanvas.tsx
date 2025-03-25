import React from "react";
import {  Dimensions } from "react-native";
import { Canvas, Image as SkiaImage, Rect } from "@shopify/react-native-skia";
import Animated, {  useAnimatedStyle } from "react-native-reanimated";
import { imageDimensions } from "../store/gridSignal";
import { gridSize } from "../store/gridSignal";
import { mapImage } from "../store/gridSignal";
import { selectedCell } from "../store/gridSignal";
import { useSignals } from "@preact/signals-react/runtime";

const GridCanvas = ({ scale, translateX, translateY }: { scale: any; translateX: any; translateY: any }) => {
    if (!imageDimensions.value) return null;
    
    const { width, height } = imageDimensions.value;
    const cols = Math.floor(width / gridSize.value);
    const rows = Math.floor(height / gridSize.value);
  
    return (
      <Animated.View style={[{ position: "absolute" }, useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateX: translateX.value }, { translateY: translateY.value }]
      }))]}>
        <Canvas style={{ width, height }}>
          {mapImage.value && <SkiaImage image={mapImage.value} width={width} height={height} />}
          {[...Array(rows)].map((_, rowIndex) =>
            [...Array(cols)].map((_, colIndex) => {
              const isSelected = selectedCell.value?.x === colIndex && selectedCell.value?.y === rowIndex;
              return (
                <Rect
                  key={`${rowIndex}-${colIndex}`}
                  x={colIndex * gridSize.value}
                  y={rowIndex * gridSize.value}
                  width={gridSize.value}
                  height={gridSize.value}
                  color={isSelected ? "red" : "rgba(0,0,255,0.3)"}
                //   onTouchStart={() => (selectedCell.value = { x: colIndex, y: rowIndex })}
                />
              );
            })
          )}
        </Canvas>
      </Animated.View>
    );
  };


  export default GridCanvas