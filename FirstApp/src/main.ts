// bootstrapApplication is a TypeScript function
// Its responsibility is to:
// - Start the Angular framework runtime
// - Create the Dependency Injection (DI) system
// - Bootstrap (initialize) the root application
import { bootstrapApplication } from '@angular/platform-browser';

// appConfig is a JavaScript Object
// This object contains global application configuration such as:
// - Router providers
// - HTTP providers
// - Error handling providers
// Angular reads this object DURING bootstrap BEFORE creating any component.
import { appConfig } from './app/app.config';

// App IS a TypeScript Class
// This class is decorated with @Component, which tells Angular:
// - This class represents a UI component
// - It has a template, styles, and metadata
// App is the ROOT component:
// - Created exactly once
// - Lives for the entire application lifetime
// - Owns the <app-root> UI area
import { App } from './app/app';

// APPLICATION BOOTSTRAP (MOST CRITICAL SECTION)
// This is where Angular ACTUALLY starts.
// Everything above only prepares definitions.
// When this function is called:
// - Angular runtime starts
// - Dependency Injection system is created
// - Root component is instantiated
// - UI rendering begins
bootstrapApplication(App, appConfig)

// If any error occurs during the bootstrap process
// (for example, invalid configuration, missing providers, missing imports, etc.),
// this catch block logs the error to the console.
  .catch((err) => console.error(err));
