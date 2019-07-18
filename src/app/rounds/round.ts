import { ARMarker, MarkerState } from '../ar-view/ar-view.component';


export interface Marker extends ARMarker{
    name: string; //temporary, This should be expanded with different types for flowers/nests
}

/**
 * A basic button
 */
export interface Button {
    display: boolean;
    text: string;
    onClick(): void;
}

export interface Round {

    readonly name: string;
    readonly description?: string;

    /**
     * A list of markers to be displayed during the round
     */
    markers: Marker[];
    
    interactButton?: Button;

    /**
     * The funtion to be called when the state of the markers change (one is found or lost)
     * @param markers the array of MarkerState objects
     */
    onMarkerState(markers: MarkerState[]) : void;
}
