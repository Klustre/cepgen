const { capitalise, transform } = require('./utils')

function makeDebugXML(extensions) {
    return (
	`<?xml version="1.0" encoding="UTF-8"?>
	<ExtensionList>
	${extensions.map((ext) => {
		return `<Extension Id="${ext.id}">
			<HostList>
				${Object.keys(ext.debug).map((host) => {
					return `<Host Name="${host}" Port="${ext.debug[host]}" />`
				}).join('\n')}
			</HostList>
		</Extension>`}).join('\n')}
	</ExtensionList>`
	)
}

function makeManifestXML(options) {
    const {
        bundle,
        version,
        extensions,
        hosts,
        pkgVersion,
    } = options

    if (bundle.version === undefined && pkgVersion === undefined) {
        console.log('Missing `version` in `package.json` or `cep.bundle`')
        process.exit(-1)
    }

    return (
    `<?xml version="1.0" encoding="UTF-8"?>
    <ExtensionManifest 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        ExtensionBundleId="${bundle.id}"
        ExtensionBundleName="${bundle.name}"
        ExtensionBundleVersion="${bundle.version || pkgVersion}"
        Version="${version}"
        >
        <ExtensionList>
            ${extensions.map((ext) => `<Extension Id="${ext.id}" Version="${ext.version || bundle.version || pkgVersion}" />`).join('\n')}
        </ExtensionList>
        <ExecutionEnvironment>
            <HostList>
                ${Object.keys(hosts).map((host) => `<Host Name="${host}" Version="${hosts[host]}" />`).join('\n')}
            </HostList>
            <LocaleList>
                <Locale Code="All"/>
            </LocaleList>
            <RequiredRuntimeList>
                <RequiredRuntime Name="CSXS" Version="${version}" />
            </RequiredRuntimeList>
        </ExecutionEnvironment>
        <DispatchInfoList>
            ${extensions.map((ext) => {
                return `<Extension Id="${ext.id}">
                    <DispatchInfo>
                    <Resources>
                        <MainPath>${ext.main}</MainPath>
                        ${ext.script ? `<ScriptPath>${ext.script}</ScriptPath>` : ''}
                        ${ext.params?.length ? 
                            `<CEFCommandLine>
                                ${ext.params.map((param) => `<Parameter>${param}</Parameter>`).join('\n')}
                            </CEFCommandLine>` : ''}
                    </Resources>
                    <Lifecycle>
                        <AutoVisible>${
                            ext.type === 'Custom' && ext.autovisible === undefined
                                ? false
                                : ext.autovisible !== undefined
                                    ? ext.autovisible
                                    : true
                        }</AutoVisible>
                        ${ext.events?.length ? 
                            `<StartOn>
                                ${ext.events.map((event) => `<Event>${event}</Event>`).join('\n')}
                            </StartOn>` : ''}
                    </Lifecycle>
                    <UI>
                        <Type>${ext.type}</Type>
                        ${ext.menu ? `<Menu>${ext.menu}</Menu>` : ''}
                        <Geometry>
                            ${Object.keys(ext.geometry).map((geo) => {
                                return `<${capitalise(geo)}>
                                    <Height>${ext.geometry[geo].height}</Height>
                                    <Width>${ext.geometry[geo].width}</Width>
                                </${capitalise(geo)}>`
                            }).join('\n')}
                        </Geometry>
                        ${ext.icons && Object.keys(ext.icons).length ? 
                        `<Icons>
                            ${Object.keys(ext.icons).map((icon) => {
								return `<Icon Type="${transform(icon)}">${ext.icons[icon]}</Icon>`
							}).join('\n')}
                        </Icons>` : ''}
                    </UI>
                </DispatchInfo>
            </Extension>`}).join('\n')}
        </DispatchInfoList>
    </ExtensionManifest>`
    )
}

module.exports = {
    makeDebugXML,
    makeManifestXML,
}
