# cepgen

## Usage
One-off with `npx`:
```
npx klustre/cepgen [--debug][--dest]
```
Installed globally:
```
npm i klustre/cepgen --global
cepgen [--debug][--dest]
```
Installed locally:
```
npm i klustre/cepgen [--save-dev | --save]
npx cepgen [--debug][--dest]
```
As `npm` script:
```
npm i klustre/cepgen [--save-dev | --save]
```
```json
"scripts": {
    "cep": "npx cepgen"
},
```

## Options

### `--debug` 
Generates a `.debug` file in the root directory. The ports are read from the `cep` object.

### `--dest <path>`
Changes the destination folder. Path should be relative to the current working directory.

## What does it do?
The script generates a `manifest.xml` in a `CSXS` folder, based on the `cep` settings in your `package.json`. Setting the `--debug` flag will generate a `.debug` file in the root directory. Or in the relative folder specified by `--dest`.

It expects that you have a `cep` object in your `package.json` with the following structure:

```jsonc
"cep": {
    "version": "6.0",
    "bundle": {
        "name": "My Bundle",
        "id": "com.mycompany",
        "version": "1.0.0"
    },
    "hosts": {
        "AEFT": "16.0"
    },
    "extensions": [
        {
            "menu": "My Panel",
            "type": "Panel", // Panel | ModalDialog | Custom | Modeless
            "version": "1.0.0",
            "main": "./index.html",
            "script": "./script.jsx", // optional
            "id": "com.mycompany.panel",
            "debug": { // required when `--debug` is set
                "AEFT": 3001
            },
            "geometry": {
                "size": {
                    "width": 200,
                    "height": 100
                },
                "min": { // optional, min | minsize | MinSize
                    "width": 400,
                    "height": 200
                },
                "max": { // optional, max | maxsize | MaxSize
                    "width": 800,
                    "height": 400
                }
            },
            "icons": { // optional
                "Normal": "./icons/icon.png", // case-insensitive
                "Disabled": "./icons/icon.png", // case-insensitive
                "Rollover": "./icons/icon.png", // case-insensitive
                "DarkNormal": "./icons/icon.png", // case-insensitive
                "DarkRollOver": "./icons/icon.png" // case-insensitive
            },
            "events": [ // optional
                "com.lifecycle.event"
            ],
            "params": [ // optional
                "--enable-nodejs",
            ]
        }
    ]
},
```
