const os = require('node:os')
const pathNode = require('node:path')
const fsp = require('node:fs/promises')

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const pkg = require('pkg')
const rcedit = require('rcedit')
const pkgFetch = require('pkg-fetch')

const packageJson = require('./package.json')

const build = async () => {
  const argv = yargs(hideBin(process.argv)).argv

  let wantedVersion = argv.NODE_VERSION
  let wantedArch = argv.ARCH ?? os.arch() // 'arm', 'arm64', 'ia32', 'mips','mipsel', 'ppc','ppc64', 's390', 's390x', 'x32', and 'x64'.
  let wantedPlatform = argv.PLATFORM ?? os.platform() // 'aix' 'darwin' 'freebsd' 'linux' 'openbsd' 'sunos' 'win32'

  if (!wantedVersion) {
    const nvmRc = await fsp.readFile('./.nvmrc', 'utf-8')

    wantedVersion = nvmRc.split('.')?.[0]
  }

  if (wantedArch !== os.arch() || wantedPlatform !== os.platform()) {
    console.log(`Build ${packageJson.name} for node ${wantedVersion}, ARCH ${wantedArch}, OS ${wantedPlatform} may not work ...`)
  } else {
    console.log(`Build ${packageJson.name} for node ${wantedVersion}, ARCH ${wantedArch}, OS ${wantedPlatform}`)
  }

  try {
    if (wantedPlatform === 'win32') {
      const pkgNodePath = await pkgFetch.need({
        nodeRange: `node${wantedVersion}`,
        platform: wantedPlatform,
        arch: wantedArch
      })

      let pkgNodeVersion = pathNode.parse(pkgNodePath)?.base

      if (pkgNodeVersion.includes('fetched')) {
        const pkgNodeBuiltVersion = pkgNodeVersion.replace('fetched', 'built')
        await fsp.rename(
          pathNode.join('pkg-cache', 'v3.5', pkgNodeVersion),
          pathNode.join('pkg-cache', 'v3.5', pkgNodeBuiltVersion),
        )

        pkgNodeVersion = pkgNodeBuiltVersion
      }

      await rcedit(pathNode.join('pkg-cache', 'v3.5', pkgNodeVersion), {
        'file-version': packageJson.version,
        'product-version': packageJson.version,
        'requested-execution-level': 'asInvoker',
        'version-string': {
          CompanyName: packageJson.author, //  "Node.js"
          ProductName: packageJson.author, // "Node.js"
          FileDescription: packageJson.description, //  "Node.js: Server-side JavaScript"
          FileVersion: packageJson.version, // NODE_EXE_VERSION
          ProductVersion: packageJson.version, // NODE_EXE_VERSION
          OriginalFilename: `${packageJson.name}.exe`, // "node.exe"
          InternalName: packageJson.name, // "node"
          LegalCopyright: `Copyright ${packageJson.author} contributors. ${packageJson.license} license.` //  "Copyright Node.js contributors. MIT license."
        },
        icon: './assets/favicon.ico'
      })
    }

    await pkg.exec([
      '.',
      '--output',
      pathNode.join('build', `${packageJson.name}-${packageJson.version}-${wantedPlatform}-${wantedArch}`),
      '--compress',
      'GZip',
      '--targets',
      `node${wantedVersion}-${wantedPlatform}-${wantedArch}`
    ])

    console.log(`ARCH ${wantedArch} OS ${wantedPlatform} build is done`)
  } catch (e) {
    console.error(`ARCH ${wantedArch} OS ${wantedPlatform} build error`, e)
  }
}

build()
  .catch((e) => {
    console.error(`Build error`, e)
  })