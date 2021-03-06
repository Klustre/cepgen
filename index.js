#! /usr/bin/env node

const { makeDebugXML, makeManifestXML } = require('./xml')
const { validate, format } = require('./utils')
const { description, version } = require('./package.json')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs-extra')
const path = require('path')
const cwd = process.cwd()
let dest = cwd

if (argv.dest) {
    if (typeof argv.dest !== 'string' || argv.dest === '/') {
        console.log('"dest" is not of type string')
        process.exit(-1)
    } else {
        dest = path.resolve(cwd, argv.dest)
    }
}

if (argv.help) {
  console.log(
  `
  ${description}

  Usage
  $ cepgen [options]

  Options
  --debug        Generates .debug file
  --dest <path>  Relative path to destination
  `)
  process.exit(0)
}

if (argv.v) {
    console.log(version)
    process.exit(0)
}

try {
    if (!fs.existsSync(`${cwd}/package.json`)) {
        console.log(`Missing "package.json" in\n  ${cwd}`)
        process.exit(-1)
    } else {
        const pkg = fs.readFileSync(`${cwd}/package.json`, 'utf8')
        const json = JSON.parse(pkg)
        validate(json, argv.debug)
        const settings = json.cep
        const xml = makeManifestXML(settings)
        fs.outputFileSync(`${dest}/CSXS/manifest.xml`, format(xml))
        console.log(`Manifest written to\n  ${dest}/CSXS/manifest.xml`)
        if (argv.debug) {
            const xml = makeDebugXML(settings.extensions)
            fs.outputFileSync(`${dest}/.debug`, format(xml))
            console.log(`Debug file written to\n  ${dest}/.debug`)
        }
        process.exit(0)
    }
} catch (error) {
    console.log(error)
    process.exit(-1)
}
