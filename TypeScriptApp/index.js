"use strict";
/**
 * TypeScript Data Types
 * Goal: Understand what each data type means and why it helps you write safer code.
 * Note: Lines that cause compile-time errors are kept commented so you can test them one by one.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// 1) number  -> used for calculations (price, age, quantity, etc.)
let price = 499.99;
let quantity = 2;
let totalAmount = price * quantity; // arithmetic is safe
console.log("Total Amount:", totalAmount);
// price = "500"; // Compile-time error: Type 'string' is not assignable to type 'number'
// 2) string -> text values (name, email, messages, labels)
let customerName = "Pranaya Rout";
let email = "pranaya@example.com";
console.log("Customer:", customerName.toUpperCase()); // string methods are available
console.log("Email:", email);
// email = 12345; // Compile-time error: Type 'number' is not assignable to type 'string'
// 3) boolean -> true/false flags (logged in?, active?, enabled?)
let isLoggedIn = true;
let isPremiumUser = false;
if (isLoggedIn) {
    console.log("User is logged in");
}
console.log("Premium User?", isPremiumUser);
// isLoggedIn = "yes"; // Compile-time error: Type 'string' is not assignable to type 'boolean'
// 4) Arrays -> list of same-type values (very common in Angular for API lists)
let cartItemPrices = [199.99, 299.5, 149];
let tags = ["Angular", "TypeScript", "WebAPI"];
console.log("Cart Prices:", cartItemPrices);
console.log("Tags:", tags.join(", "));
// cartItemPrices.push("300"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'
// 5) null vs undefined (very important in Angular forms + API handling)
// null -> intentionally empty (you are setting it empty on purpose)
// undefined -> not assigned yet (value is missing/not initialized)
let selectedCoupon = null; // can be string OR null
let deliveryInstruction; // declared but not assigned => undefined
console.log("Selected Coupon:", selectedCoupon); // null
console.log("Delivery Instruction:", deliveryInstruction); // undefined
// Using them safely:
if (selectedCoupon === null) {
    console.log("No coupon applied yet.");
}
if (deliveryInstruction === undefined) {
    console.log("No delivery instruction provided yet.");
}
// 6) any -> allows ANY type (TypeScript stops protecting you) - NOT recommended in Angular
let dynamicValue = "100";
// TypeScript allows this, but it may crash at runtime depending on the value:
console.log("dynamicValue (any) as string:", dynamicValue.toUpperCase()); // works now
dynamicValue = 100;
// The next line compiles fine, but will crash at runtime because 100 has no toUpperCase()
// console.log(dynamicValue.toUpperCase()); // Runtime error if you uncomment
// 7) unknown -> safer than any (forces you to check type before use)
let apiResponse = "SUCCESS";
// console.log(apiResponse.toUpperCase()); // Error: Object is of type 'unknown'
// Safe usage with type check (type narrowing)
if (typeof apiResponse === "string") {
    console.log("API Response (string):", apiResponse.toUpperCase());
}
apiResponse = 200;
if (typeof apiResponse === "number") {
    console.log("API Response (number):", apiResponse.toFixed(2));
}
//# sourceMappingURL=index.js.map