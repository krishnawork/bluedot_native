// ✅ Define Sensor Data Types
export interface WiFiData {
    ssid: string;
    rssi: number;
}

export interface MagneticData {
    x: number;
    y: number;
    z: number;
}

export interface MovementData {
    accX: number;
    accY: number;
    accZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
}

export interface SensorEntry {
    timestamp: string;
    wifi: WiFiData[];
    magnetic: MagneticData;
    movement: MovementData;
    mode: 'static' | 'walking' | 'rotation';
}

// ✅ Define Modes Type
export type ModeType = 'static' | 'walking' | 'rotation';