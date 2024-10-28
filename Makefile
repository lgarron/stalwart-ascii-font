.PHONY: build
build: dist/stalwart-ascii-font.json
	bun run script/build.ts

dist/stalwart-ascii-font.json: script/build.ts src/characters.txt
	bun run script/build.ts

.PHONY: dev-demo
dev-demo: build
	bun run script/dev-demo.ts

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: test
test: setup lint build sample sample-mono

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

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: reset
reset: clean
	rm -rf ./node_modules

