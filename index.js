#! /usr/bin/env node

const { makeDebugXML, makeManifestXML } = require('./xml')
const { validate, format } = require('./utils')
const { description, version } = require('./package.json')
const example = require('./example.json')
const argv = require('minimist')(process.argv.slice(2))
const fs = require('fs-extra')
const path = require('path')
const cwd = process.cwd()
let dest = cwd

if (argv.help) {
    console.log(
        `
    ${description}
  
    Usage
    $ cepgen [options]
  
    Options
    --init         Adds config to package.json
    --debug        Generates .debug file
    --dest <path>  Relative path to destination
    `)
    process.exit(0)
}

if (argv.init) {
    try {
        const pkgPath = `${cwd}/package.json`
        const exists = fs.existsSync(pkgPath)
        const pkg = exists ? fs.readJSONSync(pkgPath) : {}
        pkg.cep = example
        fs.outputJSONSync(pkgPath, pkg, { spaces: '\t' })
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(-1)
    }
}

if (argv.dest) {
    if (typeof argv.dest !== 'string' || argv.dest === '/') {
        console.log('"dest" is not of type string')
        process.exit(-1)
    } else {
        dest = path.resolve(cwd, argv.dest)
    }
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
        const pkgVersion = json.version
        const xml = makeManifestXML({
            ...settings,
            pkgVersion
        })
        fs.outputFileSync(`${dest}/CSXS/manifest.xml`, format(xml))
        const rel = path.relative(cwd, dest)
        console.log(`Manifest written to .${rel}/CSXS/manifest.xml`)
        if (argv.debug) {
            const xml = makeDebugXML(settings.extensions)
            fs.outputFileSync(`${dest}/.debug`, format(xml))
            console.log(`Debug file written to .${rel}/.debug`)
        }
        process.exit(0)
    }
} catch (error) {
    console.log(error)
    process.exit(-1)
}
