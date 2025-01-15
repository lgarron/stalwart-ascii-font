.PHONY: build
build: setup dist/stalwart-ascii-font.json
	bun x readme-cli-help --fence "text-sample-regular" "bun run ./script/sample.ts"
	bun x readme-cli-help --fence "text-sample-mono" "bun run ./script/sample.ts --mono"

dist/stalwart-ascii-font.json: script/build.ts src/characters.txt
	bun run script/build.ts

.PHONY: dev
dev: build demo-dev

.PHONY: demo-dev
demo-dev: build
	bun run script/demo/dev.ts

.PHONY: demo-build
demo-build: build
	bun run script/demo/build.ts

.PHONY: deploy
deploy: demo-build
	bun x @cubing/deploy

.PHONY: setup
setup:
	bun install --no-save

.PHONY: test
test: setup lint build sample sample-mono

.PHONY: lint
lint: setup
	bun x @biomejs/biome check ./script ./src
	bun x readme-cli-help --check-only --fence "text-sample-regular" "bun run ./script/sample.ts"
	bun x readme-cli-help --check-only --fence "text-sample-mono" "bun run ./script/sample.ts --mono"

.PHONY: format
format: setup
	bun x @biomejs/biome format --write ./script ./src

.PHONY: publish
publish: setup
	npm publish

.PHONY: sample
sample: setup
	bun run "script/sample.ts"

.PHONY: sample-mono
sample-mono: setup
	bun run "script/sample.ts" --mono

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: reset
reset: clean
	rm -rf ./node_modules

