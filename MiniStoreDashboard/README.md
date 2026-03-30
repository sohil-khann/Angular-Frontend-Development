# MiniStoreDashboard

Angular Nested Component Real-time Application: Mini Store Dashboard

Parent Component controls the State and Data
In Angular, a single component should own and control the main data for a screen. That component is called the Container (Parent / Smart) component. In this app, the container controls:

Products → What data exists on the screen
Filters → Which category/search is currently selected
Selected Product → Which product is currently chosen for Quick View
Cart Count → The current cart number shown in the header
Key Note: The container is the single source of truth. That means: only the container decides what the UI should show.

Child components display UI and raise actions
Child components are created to split a big screen into smaller, reusable UI parts. Child components mainly do two things:

Display UI using the data they receive
Raise actions/events when the user interacts
They do not control the application’s main state.

Key Note: Child components are like “UI pieces” that depend on the container.

Data Flow in Our App:
Angular uses a clear, controlled communication system between parent and child components.

A) Parent → Child (Downward data flow)
This happens when the parent wants the child to show something.

Examples (conceptually):

Parent sends the cart count to the header so the header can show it
Parent sends filter values to the filter section so it can display selected options
Parent sends a list of products to the grid so it can display cards
Key Note: Parent-to-child is about data sharing and is usually one-way.

B) Child → Parent (Upward communication)
This happens when something happens inside a child, and the child wants to inform the parent. Examples:

User clicks Add → Child informs parent Add this product.
User clicks View → Child informs parent Show details for this product.
User changes filter → Child informs parent Update filters.
User clicks Clear Cart → Child informs parent Clear the cart.
Key Note: Child-to-parent is about notification (“something happened”), not about controlling the state.

What actually happens when the user clicks View?
When a user clicks View on a product card:

The card component does not display details by itself
The card only says, “User wants to view this product.”
Then the container (parent) decides:

Where to show the details (Quick View panel, modal, new page, etc.)
What exact UI should be updated?
Key Note: Children request actions. The parent decides what to do.




This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
