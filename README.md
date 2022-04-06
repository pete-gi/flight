# Flight

Small library for simplifying manipulating the DOM. Created mainly for server-rendered websites which don't need super frontend frameworks.

Name "Flight" comes from "Frontend-light".

## Installation

npm:

```
npm install @petegi/flight
```

yarn:

```
yarn add @petegi/flight
```

or just download it.

## Implementation

Via `<script>` tag (after your HTML code, before `</body>` and other scripts)

```
<script src="dist/flight.js">
```

Via ES6 module (you can place it in `<head>` if you'd like)

```
<script defer type="module">
  import './dist/index.js'
</script>
```

Via import from node_modules

```
import "@petegi/flight
```

That's it, ready to use. Flight installs itself on the `window` object to be globally available.

Flight **must** be loaded after your HTML code to be able to create events and event listeners, and apply values/refs.

Thanks to only one, simple dependency, you can add Flight only on the pages you need it, and so the controllers - register them only on the pages that have to use them.

## Usage

Flight, similarly to Stimulus (if you've used it) uses the namespaces (named _controllers_) to define interaction with the DOM.

1. Register your controller

```
window.FL.registerController("nav", class {
  static open = false;
  static navElement

  static toggle() {
    this.open = !this.open;
  }
})
```

2. Attach attributes to your HTML code

```
<nav
  fl-ref="nav#navElement"
  fl-value="nav#open:hidden"
  ></nav>
  <!-- ref is not used here, but you'll propably want it -->
  <!-- value of "open" property placed in "nav" controller will be attached to this element's "hidden" attribute -->

<button
  fl-ref="click:nav#toggle"
  >Toggle</button>
  <!-- call "toggle" method in "nav" controller on "click" -->
```

3. Try it in your code!

## Reference

- `fl-ref` - used to reference HTML element (or elements) in your controller:

  ```
  <p fl-ref="controller#property"
  ></p>
  ```

  After start, Flight will attach it to your property:

  ```
  // controller named "controller"
  class {
    static property = /* your HTMLParagraphElement */;
  }
  ```

  You can also reference array of elements (yes, array, not NodeList!). Just add `[]` to property name in your HTML, so Flight will know to create an array of elements

  ```
  <p fl-ref="controller#property[]"
  ></p>
  <p fl-ref="controller#property[]"
  ></p>
  ```

  ```
  // controller named "controller"
  class {
    static property = [ /* your HTMLParagraphElements */ ];
  }
  ```

- `fl-value` - used to attach value to elements' attribute

  ```
  <p fl-value="controller#property:attribute"
  ></p>
  ```

  If you set a value in your controller, it will applied to your attribute at the start of your app

  Example:

  ```
  <!-- HTML -->
  <p fl-value="index#value:innerText"></p>

  // JavaScript
  // controller named "index"
  class {
    static value = "Hello world!"
  }
  ```

  will produce

  ```
  <p fl-value="index#value:innerText">
    Hello world!
  </p>
  ```

- `fl-action` - used to create interaction

  ```
  <button fl-action="event:controller#method?modifier"></button>
  ```

  The `?modifier` is optional, but you can use it to:

  - `?prevent` default,
  - `?stop` propagation,
  - `?stopImmediate` propagation.

  Example:

  ```
  <!-- HTML -->
  <button fl-action="click:toggle#onClick">
  <button fl-action="click:toggle#onClickWithPrevent?prevent">
  <input fl-action"keydown.Escape:toggle#close" >

  // JavaScript
  // controller named "toggle"
  class {
    static onClick() {
      // your code
    }
    static onClickWithPrevent() {
      // event.preventDefault() will be internally called thanks to `?prevent` modifier
      // your code
    }
    static close() {
      // will be called when you `keydown` the `Escape` key on the input element
    }
  }
  ```

## FAQ

1. **How can I reference a property or call a method from another controller?**

   Flight is global and so are controllers. You can get to them with:

   ```
   window.FL.controllers
   ```

   Try it in your browser's console!

2. **Why there's nothing like `fl-model`, `fl-if`?**

   Because I didn't need it. Using available `fl-`s it's super easy to build these functionalities by yourself.

3. **Can I use TypeScript?**

   Yes, you can! Controllers are **not** modified by Flight in **any** way, so you can use whatever you like. Check out the `index.html` file to see how

4. **Why not just use Stimulus, which does the same things and has similar syntax?**

   Syntax is similar, but (in my opinion) harder to understand. In Stimulus, you have to specify `targets` and `values` arrays to define properties (like `"input"` in `targets`) and reference to them by internally modified property name (`this.inputTarget`).

   In Flight, you use them the way you define them. Clear, basic JavaScript.

5. **Is Flight in any way better than React, Vue, Angular, Svelte, Stimulus, Lit, Stencil or my own framework I just created?**

   Of course not. I created it for my own purposes, needed something really simple and easy to use, something that works nicely with TypeScript and can be used wherever I need it, not everywhere. To be honest, I decided to create it after trying Stimulus and not liking the way it works.

6. **Can I change the `fl-` prefix to something else? Like `data-`?**

   Right now there's no option to do that. But you can modify the code of the library to your own preference (in this case, search for `prefix` and change it's value). This way you also change attribute names or even separators (`#`, `:`, `?`, `.`) - there are properties for almost everything you'll need.

## Licence

MIT
