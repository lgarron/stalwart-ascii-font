.PHONY: build
build:
	bun run script/build.ts

.PHONY: lint
lint:
	bun x @biomejs/biome check ./script ./src

.PHONY: format
format:
	bun x @biomejs/biome format --write ./script ./src

.PHONY: publish
publish:
	npm publish

.PHONY: sample
sample:
	bun run "script/sample.ts"

.PHONY: sample-mono
sample-mono:
	bun run "script/sample.ts" --mono
