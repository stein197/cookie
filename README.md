# Tiny JavaScript cookie library
This tiny library provides a simple way for managing cookies in a browser.

## Installation
```
npm install @stein197/cookie
```

## Usage
```ts
import Cookie from "@stein197/cookie";

const cookie = new Cookie(document);
cookie.get("key");                       // Return a value denoted by a key
cookie.get();                            // Return all cookies
cookie.set("key", "value", {path: "/"}); // Set a single value
cookie.set({key: "value"});              // Set multiple values
cookie.has("key");                       // Returns true if there is a value associated with the key
cookie.unset("key");                     // Remove an entry by a key
cookie.clear();                          // Remove all entries
cookie.parse("key=value");               // Parse cookie string
cookie.stringify({key: "value"});        // Stringify an object
// ...
```
### API
> Refer to the source code for the documentation, please

## NPM scripts
- `clean` Deletes compiled files
- `test` Runs unit tests
- `build` Builds the project
