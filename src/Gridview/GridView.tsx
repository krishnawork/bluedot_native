import React, { useEffect, useState } from "react";
import { View, ScrollView, useWindowDimensions } from "react-native";
import Svg, { Rect } from "react-native-svg";
import { selectedRectCell } from "../store/gridSignal";
import { DataGridProps } from "../types/gridViewTypes";

const GRID_SIZE = 50; // Ek cell ka size (px)

const DataGrid = ({highlightCell}:DataGridProps) => {
  const { width, height } = useWindowDimensions();
  const NUM_COLS = Math.floor(width / GRID_SIZE);
  const NUM_ROWS = Math.floor(height / GRID_SIZE);



  const handleCellPress = (col: number, row: number) => {
    selectedRectCell.value = `${col},${row}`;
  };




  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{
        width: NUM_COLS * GRID_SIZE,
        height: NUM_ROWS * GRID_SIZE,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      <Svg width={NUM_COLS * GRID_SIZE} height={NUM_ROWS * GRID_SIZE}>
        {Array.from({ length: NUM_ROWS }).map((_, row) =>
          Array.from({ length: NUM_COLS }).map((_, col) => {
            const pointKey = `${col},${row}`;
            // let fillColor = "#ddd"; // Default grid color
           const fillColor = highlightCell === pointKey ? "#f39c12" : "#ddd"; // Selected color
            // if (collectedPoints.has(pointKey)) {
            //   fillColor = "#3498db"; // Data collected points
            // }

            // if (currentPosition === pointKey) {
            //   fillColor = "#e74c3c"; // Current position
            // }

            return (
              <Rect
                key={pointKey}
                x={col * GRID_SIZE}
                y={row * GRID_SIZE}
                width={GRID_SIZE}
                height={GRID_SIZE}
                fill={fillColor}
                stroke="black"
                strokeWidth={0.5}
                onPressIn={() => handleCellPress(col, row)} // Click Event
                
              />
            );
          })
        )}
      </Svg>
    </ScrollView>
  );
};

export default DataGrid;
