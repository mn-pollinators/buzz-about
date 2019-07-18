import { ARMarker, MarkerState } from '../ar-view/ar-view.component';


export interface Marker extends ARMarker{
    name: string; //temporary, This should be expanded with different types for flowers/nests
}

export interface Button {
    display: boolean;
    text: string;
    onClick(): void;
}

export interface Round {

    readonly name: string;
    readonly description?: string;

    markers: Marker[];
    
    interactButton?: Button;

    onMarkerState(markers: MarkerState[]) : void;
}
