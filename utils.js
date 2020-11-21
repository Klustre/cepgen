function validate(config, debug) {
	const validate = require('jsonschema').validate
	const schema = require(`./schema.json`)
	if (debug) {
		const required = 
			schema.properties.cep.properties.extensions.items.required 
		required.push('debug')
	}
	const validation = validate(config, schema)
	const valid = validation.valid
	if (!valid) {
		const errors = validation.errors.map((error) => {
			const stack = error.stack.replace('instance', 'package')
			const words = stack.split(' ')
			const path = words[0].toString()
			return `${path}\n  ${words.slice(1).join(' ')}`
		}).join('\n')
		throw errors
	}
}

function capitalise(key) {
	key = key.toLowerCase()
    if (key.includes('min')) return 'MinSize'
    if (key.includes('max')) return 'MaxSize'
    if (key.includes('screen')) return 'ScreenPercentage'
    return key.replace(/^\w/, (c) => c.toUpperCase())
}

function format(xml) {
	const xmlFormat = require('xml-formatter')
    return xmlFormat(xml, { collapseContent: true })
}

function transform(key) {
	key = key.toLowerCase()
	if (key.includes('dis')) return 'Disabled'
	const dark = key.includes('dark')
	const roll = key.includes('roll')
	const newKey = !roll ? 'Normal' : 'RollOver'
	return dark ? `Dark${newKey}` : newKey
}

module.exports = {
    validate,
    capitalise,
    format,
    transform,
}
