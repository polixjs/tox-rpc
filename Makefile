VERSION = $(shell cat package.json | awk -F '"' '/version" *: *"/{print $$4}')
PROJECT_NAME = $(shell cat package.json | awk -F '"' '/name" *: *"/{print $$4}')
NODE_V = $(shell node -v)
OUT_PATH = ${PROJECT_NAME}_${VERSION}
IMAGE_VERSION ?= ${VERSION}_rc02

TARGET ?= tox-rpc

TESTS          = $(sort $(shell find test -type f -name "*.test.js"))
-BIN_MOCHA    := ./node_modules/.bin/_mocha

eslint:
	@eslint .

install:
	@npm install --registry http://registry.npm.taobao.org

test: node_v
	NODE_ENV=test $(-BIN_MOCHA) -R spec -t 60000 --exit -r $(TESTS)

bench: node_v
	@node benchmark/test.js

node_v:
	@echo '当前 Node.js 版本：'$(NODE_V)

.PHONY: install test node_v bench