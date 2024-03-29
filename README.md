# cepgen

## What does it do?
`cepgen` generates a `manifest.xml` in a `CSXS` folder, based on the `cep` settings in your `package.json`. Setting the `--debug` flag will generate a `.debug` file in the root directory. Or in the relative folder specified by `--dest`.

## Usage
One-off with `npx`:
```
npx klustre/cepgen [--debug][--dest][--init]
```
Installed globally:
```
npm i klustre/cepgen --global
cepgen [--debug][--dest][--init]
```
Installed locally:
```
npm i klustre/cepgen [--save-dev | --save]
npx cepgen [--debug][--dest][--init]
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

### `--init`
Adds an example `cep` config to `package.json`. Note that it will overwrite the existing `cep` config.


## Config
`cepgen` expects a `cep` object in your `package.json` with the following structure:

```jsonc
"cep": {
    "version": "6.0",
    "bundle": {
        "name": "My Bundle",
        "id": "com.mycompany",
        "version": "1.0.0" // optional, uses package version when omitted
    },
    "hosts": {
        "AEFT": "16.0"
    },
    "extensions": [
        {
            "menu": "My Panel", // optional
            "type": "Panel", // Panel | ModalDialog | Custom | Modeless
            "version": "1.0.0", // optional, uses bundle version when omitted
            "main": "./index.html",
            "script": "./script.jsx", // optional
            "id": "com.mycompany.panel",
            "autovisible": true, // optional
            "debug": { // required when `--debug` is set
                "AEFT": 3001
            },
            "geometry": { // optional, when type is `Custom`
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
