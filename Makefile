.PHONY: build
build: build-dist build-demo

.PHONY: check
check: lint test build check-package.json

build-dist: script/build.ts src/characters.txt
	bun run script/build.ts
	bun x -- bun-dx --package readme-cli-help readme-cli-help -- update

.PHONY: dev
dev: build demo-dev

.PHONY: demo-dev
demo-dev: build
	bun run script/demo/dev.ts

.PHONY: build-demo
build-demo: build-dist
	bun run script/demo/build.ts

.PHONY: deploy
deploy: build-demo
	bun x -- bun-dx --package @cubing/deploy deploy --

.PHONY: setup
setup:
	bun install --no-save

.PHONY: test
test: setup lint build test-bin print-sample print-sample-mono

.PHONY: lint
lint: setup lint-typescript
	bun x -- bun-dx --package @biomejs/biome biome -- check ./script ./src
	bun x -- bun-dx --package readme-cli-help readme-cli-help -- check

.PHONY: lint-typescript
lint-typescript: build-dist
	bun x -- bun-dx --package typescript tsc -- --project ./tsconfig.json

.PHONY: format
format: setup
	bun x -- bun-dx --package @biomejs/biome biome -- format --write ./script ./src

.PHONY: check-package.json
check-package.json: build
	bun x -- bun-dx --package @cubing/dev-config package.json -- check

.PHONY: prepublishOnly
prepublishOnly: clean check build

.PHONY: publish
publish: setup
	npm publish

.PHONY: test-bin
test-bin:
	'src/bin/main.ts' --help
	'src/bin/main.ts' --version
	'src/bin/main.ts' -- "HELLO WORLD"
	'src/bin/main.ts' --mono -- "HELLO WORLD"

.PHONY: print-sample
print-sample: build
	bun run "script/print-sample.ts"

.PHONY: print-sample-mono
print-sample-mono: build
	bun run "script/print-sample.ts" --mono

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: reset
reset: clean
	rm -rf ./node_modules
