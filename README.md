# Deluxe Paint

→ [View Deluxe Paint](https://deluxe-paint.oinam.com)

Webbased image editor modeled after the legendary [Deluxe Paint](https://en.wikipedia.org/wiki/Deluxe_Paint) with a focus on retro Amiga file formats.
Next to modern image formats, DPaint.js can read and write Amiga icon files and IFF ILBM images.

## Credit

- [Original Source](https://github.com/steffest/dpaint-js) from [Steffest](https://www.stef.be).

---

## Main Features
 - Fully Featured image editor with a.o.
   - Layers
   - Selections
   - Masking
   - Transformation tools
   - Effects and filters
   - Multiple undo/redo
   - Copy/Paste from any other image program or image source
   - Customizable dither tools
 - Heavy focus on colour reduction with fine-grained dithering options
 - Amiga focus
   - Read/write/convert Amiga icon files (all formats)
   - Reads IFF ILBM images (all formats including HAM and 24-bit)
   - Writes IFF ILBM images (up to 32 colors)
   - Read and write directly from Amiga Disk Files (ADF)
   - Embedded Amiga Emulator to preview your work in the real Deluxe Paint.

## Free and Open

It runs in your browser, works on any system and works fine on touch-screen devices like iPads.  
It is written in 100% plain JavaScript and has no dependencies.  
It's 100% free, no ads, no tracking, no accounts, no nothing.  
All processing is done in your browser, no data is sent to any server.  

The only part that is not included in this repository is the Amiga Emulator Files.
(The emulator is based on the [Scripted Amiga Emulator](https://github.com/naTmeg/ScriptedAmigaEmulator))

## Building

DPaint.js doesn't need building.  
It also has zero dependencies so there's no need to install anything.  
DPaint.js is written using ES6 modules and runs out of the box in modern browsers.  
Just serve "index.html" from a webserver and you're good to go.  

There's an optional build step to create a compact version of DPaint.js if you like.  
I'm using [Parcel.js](https://parceljs.org/) for this.  
For convenience, I've included a "package.json" file.  
open a terminal and run `npm install` to install Parcel.js and its dependencies.
Then run `npm run build` to create a compact version of DPaint.js in the "dist" folder.

## Documentation
Documentation can be found at https://www.stef.be/dpaint/docs/

## Contributing
Current version is still alpha.  
I'm sure there are bugs and missing features.  
Bug reports and pull requests are welcome.

### Missing Features
Planned for a future release if there's a need for it.

  - Support for non-square pixel modes such as HiRes and Interlaced
  - Animation support (Working on it, it won't be frame based, though, but using a timeline, like e.g. Adobe Animate)
  - Shading/transparency tools that stay within the palette.
  - Color Cycling
  - PSD import and export
  - Animated GIF import/export
  - SpriteSheet support
  - Write HAM,SHAM and Dynamic HiRes images

