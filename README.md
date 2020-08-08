<div align="center">

<img alt="Buzz About Icon" src="https://raw.githubusercontent.com/mn-pollinators/buzz-about/master/src/assets/icons/icon-circle.svg?sanitize=true" width="150"/>

# Buzz About

[![Build Status][Angular Tests badge]][Angular Tests page]
[![Deployment Status][Deploy badge]][Deploy page]

</div align="center">


Buzz About is a participatory simulation that teaches people about native pollinators of Minnesota.

Buzz About is a web app built with [Angular][] and [Firebase][].

## Usage

<!-- These instructions are necessarily quite broad, but let me know if there's anything you think we should add! -->

To set up a simulation, you'll need to print out [these markers][AR Markers] and set them up around the room. Markers 1&ndash;16 are flowers; the rest are pollinator nests.

Once you've set up the markers, you can go to [buzzabout.app][] to host a session. When you create a session, you'll be given a join code; if participants open [buzzabout.app/play][] on their phone or tablet, they can type in the join code to play the simulation with you.

In the simulation, each participant acts as a different pollinator, trying to collect pollen from the flowers. Make sure you bring enough pollen back to your nest before the time runs out!

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


[Angular Tests badge]: ../../workflows/Angular%20Tests/badge.svg
[Angular Tests page]: ../../actions?query=workflow%3A"Angular+Tests"
[Deploy badge]: ../../workflows/Firebase%20Deploy/badge.svg
[Deploy page]: ../../actions?query=workflow%3A"Firebase+Deploy"
[Angular]: https://angular.io/
[Firebase]: https://firebase.google.com/
[AR Markers]: ./AR_Markers.pdf
[buzzabout.app]: html://buzzabout.app
[buzzabout.app/play]: html://buzzabout.app/play
