# Tiny JavaScript cookie library
Install it via npm:
```
npm install @stein197/cookie
```
Or download it directly from release page. This tiny package can be used in both Node.js and browser environments. Use the package like follows in Node.js:
```ts
import * as cookie from "@stein197/cookie";
cookie.parse(parsed);
// ...
```
and in browser:
```html
<script src="cookie.min.js"></script>
<script>
	cookie.get();
	// ...
</script>
```
All functions are located in `cookie` object. Most functions are supposed to be used in browser. The only functions that can be used in Node.js are `parse()` and `stringify()`. The browser can run all existing functions. All cookies that are going to be set will have "/" path by default if not overriden explicitly:
```ts
cookie.set("key", "value"); // "key=value;path=/"
cookie.set("key", "value", {
	path: "/path/"
}); // "key=value;path=/path/"
```
All cookies keys and values are encoded before saving and decoded before parsing so it is possible to use special or unicode characters:
```ts
cookie.set("=", ";"); // "%3D=%3B"
cookie.get("="); // ";"
```

## API
All functions are located in `cookie` object (if embedded in a browser with `<script>` tag). The next table shows all available functions:
|**Function**|**Return type**|**Description**|
|-|-|-|
|`get()`<br/>`get(<key>)`|`Object`<br/>`string`|Retrieves cookie from current browser session. Retrieves either all cookies or only single entry. Returns `null` if there is/are no cookie(s).|
|`set(<key>, <value>, [<attributes>])`<br/>`set(<object>)|`void`|Sets cookie(s) to the current browser session. Can be set a single entry or a set of entries.|
|`unset(<key>)`|`void`|Deletes single cookie entry from current browser session if possible.|
|`clean()`|`void`|Cleans out all cookies from current browser session if possible.|
|`parse(<string>)`|`object`|Parses cookie string into an object.|
|`stringify(<data>, [<asHeader>])`|`string`|Converts cookies object to string. The sencod parameter defines format of the result. If `true`, the result will be returned to be used in "Set-Cookie" HTTP header, otherwise returns set of key-value pairs separated by "=" sign and delimited by "; " char. `true` by default.|
|`enabled()`|`boolean`|Returns `true` if cookies are enabled in a browser.|

## Tasks
The package has next npm scripts that can be used:
- `build`. Builds source code.
