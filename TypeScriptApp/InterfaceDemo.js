"use strict";
/**
 * TypeScript Interface
 * Interface = a "contract" that defines the exact SHAPE of an object.
 * It tells TypeScript:
 *   - which properties must exist
 *   - what type each property should be
 *   - which properties are optional
 *
 * In Angular, interfaces are commonly used for:
 *   - API response models (DTOs)
 *   - Component input models
 *   - Service method return types
 */
console.log("=== Interface Demo ===");
// 2) Create an object that MUST match the interface shape
// We are NOT creating an object of the interface
// We are creating plain JavaScript objects that are checked against the interface
// It means: Create a normal JavaScript object, and tell TypeScript to VERIFY that it matches IUser
const user1 = {
    id: 101,
    name: "Pranaya Rout",
    email: "pranaya@example.com"
    // isActive is optional, so we can skip it
};
const user2 = {
    id: 102,
    name: "Ravi",
    email: "ravi@example.com",
    isActive: true
};
console.log("User1:", user1);
console.log("User2:", user2);
// user1.id = "103"; 
// Compile-time error if uncommented: Type 'string' is not assignable to type 'number'
// 3) Interface for list/array of objects (very common in Angular)
const users = [user1, user2];
console.log("Total Users:", users.length);
// users.push({ id: 103, name: "A", email: 123 });
// Error if uncommented: Type 'number' is not assignable to type 'string' (email must be string)
console.log("=== End ===");
