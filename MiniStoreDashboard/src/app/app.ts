// Importing Component decorator from Angular core library
// This decorator is used to define an Angular component
import { Component } from '@angular/core';

// Importing the StoreContainer component
// This is a child (nested) component that will be used inside this component's template
import { StoreContainer } from './store/store-container/store-container';

// @Component decorator defines metadata for this component
@Component({
  // Selector is the custom HTML tag used to render this component
  // <app-root></app-root>
  // It will be used inside index.html
  selector: 'app-root',

  // Imports array is used because this is a Standalone Component
  // It tells Angular which components can be used inside this component's template
  imports: [StoreContainer],

  // HTML template file associated with this component
  // This file contains the UI structure
  templateUrl: './app.html',

  // CSS file associated with this component
  // This file contains styles specific to this component
  styleUrl: './app.css'
})

// Root component class of the Angular application
// This component acts as the entry point of the app
export class App {
  // Currently, no logic is needed here
  // Child components like StoreContainer handle the main functionality
}