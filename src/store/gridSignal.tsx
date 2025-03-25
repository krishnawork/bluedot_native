import { computed, signal } from "@preact/signals-react";
import GridView from '../Gridview/GridView';
import { SkImage } from "@shopify/react-native-skia";

export let selectedRectCell = signal<string | null>(null);

export let renderGrid = computed(()=>{
    return <GridView highlightCell={selectedRectCell.value} />
});


// grid canvas

// Signals for Grid and Image Data
export const imageDimensions = signal<{ width: number; height: number } | null>(null);
export const selectedCell = signal<{ x: number; y: number } | null>(null);
export const mapImage = signal<SkImage | null>(null); // Fix: SkImage instead of string
export const gridSize = signal(50); // Default grid size