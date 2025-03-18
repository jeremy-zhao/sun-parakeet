import fs from 'fs-extra'

if (fs.existsSync('../sun-parakeet-demo/src/lib')) {
  fs.rmSync('../sun-parakeet-demo/src/lib', { recursive: true, force: true })
}

if (fs.existsSync('../sun-parakeet-demo/src/routes/demo')) {
  fs.rmSync('../sun-parakeet-demo/src/routes/demo', { recursive: true, force: true })
}

if (fs.existsSync('./dist')) {
  fs.copySync('./dist/', '../sun-parakeet-demo/src/lib/')
}

fs.copySync('./src/routes/demo/', '../sun-parakeet-demo/src/routes/demo/')
