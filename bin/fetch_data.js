#!/usr/bin/env node

// npm installs a GitHub dependency from a tarball, and tarballs leave the
// minecraft-data submodule empty. Fetch the pinned data commit with git instead.
const { execFileSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'minecraft-data')
if (fs.existsSync(path.join(dir, 'data', 'dataPaths.json'))) process.exit(0)

const { repository, commit } = require('../package.json').minecraftData
fs.rmSync(dir, { recursive: true, force: true })
fs.mkdirSync(dir)
const git = (...args) => execFileSync('git', args, { cwd: dir, stdio: 'inherit' })
git('init', '-q')
git('fetch', '-q', '--depth', '1', repository, commit)
git('-c', 'advice.detachedHead=false', 'checkout', '-q', 'FETCH_HEAD')
