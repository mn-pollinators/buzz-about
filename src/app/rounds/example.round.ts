import { Round, Marker, Button } from './round';
import { MarkerState } from '../ar-view/ar-view.component';

export class ExampleRound implements Round{

    name: string;    
    description?: string;
    markers: Marker[];

    interactButton: Button = { 
        display: false,
        text: "Interact",
        onClick: this.buttonClick
    };

    constructor(name: string, markers: Marker[]) {
        this.name = name;
        this.markers = markers;
    }

    onMarkerState(markers: MarkerState[]): void {
        for(let marker of markers) {
            if(marker.found) {
                this.interactButton.display = true;
                this.interactButton.text = "Visit " + this.markers.find((value) =>
                    marker.barcodeValue == value.barcodeValue).name;
                return;
            }
        }
        this.interactButton.display = false;
    }

    buttonClick() {
        console.log("button clicked");
    }
}
