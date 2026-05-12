# Build

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

Output is written to `dist/`.

## Releasing

Releases are published automatically via GitHub Actions when a version tag is pushed.

```bash
git tag v1.0.0
git push origin v1.0.0
```

This builds the project, zips `dist/`, and attaches it as a downloadable asset to a new GitHub Release at the `v*` tag. Release notes are auto-generated from commits between tags.
