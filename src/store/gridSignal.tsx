import { computed, signal } from "@preact/signals-react";
import GridView from '../Gridview/GridView';

export let selectedCell = signal<string | null>(null);

export let renderGrid = computed(()=>{
    return <GridView highlightCell={selectedCell.value} />
});