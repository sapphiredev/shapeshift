# Changelog

All notable changes to this project will be documented in this file.

# [2.2.0](https://github.com/sapphiredev/shapeshift/compare/v2.0.0...v2.2.0) - (2022-04-29)

## Bug Fixes

- Ensure `BaseError` is exported as value (#95) ([335d799](https://github.com/sapphiredev/shapeshift/commit/335d799ef7a8c1a19a12e3eeec07e6d210db113d))

## Documentation

- **readme:** Add todo notice for `reshape` and `function` validations (#75) ([d5f16f6](https://github.com/sapphiredev/shapeshift/commit/d5f16f615de83503187dc834c6245fafbf138f5e))

## Features

- Add Typed Array (#78) ([ca5ea5f](https://github.com/sapphiredev/shapeshift/commit/ca5ea5f568084bd5d3aa004911d4ea64329e1a89))

## Performance

- Optimize `NativeEnum` (#79) ([e9ae280](https://github.com/sapphiredev/shapeshift/commit/e9ae280f73e9ea08239bd8bd22165fe0b2178f82))

# [@sapphire/shapeshift@2.1.0](https://github.com/sapphiredev/shapeshift/compare/v2.0.0...@sapphire/shapeshift@2.1.0) - (2022-04-24)

## Documentation

- **readme:** Add todo notice for `reshape` and `function` validations (#75) ([d5f16f6](https://github.com/sapphiredev/shapeshift/commit/d5f16f615de83503187dc834c6245fafbf138f5e))

## Performance

- Optimize `NativeEnum` (#79) ([e9ae280](https://github.com/sapphiredev/shapeshift/commit/e9ae280f73e9ea08239bd8bd22165fe0b2178f82))

## [2.0.0](https://github.com/sapphiredev/shapeshift/compare/v1.0.0...v2.0.0) (2022-03-13)

### Features

-   add `default` ([#25](https://github.com/sapphiredev/shapeshift/issues/25)) ([378c51f](https://github.com/sapphiredev/shapeshift/commit/378c51fb4ba2c501fd782387169db888d6bfe662))
-   add bigint methods ([#32](https://github.com/sapphiredev/shapeshift/issues/32)) ([4c444c1](https://github.com/sapphiredev/shapeshift/commit/4c444c15657c4610b99481b6dec9812bd136d72b))
-   add MapValidator ([#21](https://github.com/sapphiredev/shapeshift/issues/21)) ([c4d1258](https://github.com/sapphiredev/shapeshift/commit/c4d12586762d446b858454077b66635d9d11e2d6))
-   add NativeEnum validator ([#54](https://github.com/sapphiredev/shapeshift/issues/54)) ([7359042](https://github.com/sapphiredev/shapeshift/commit/7359042843d1119f396ac2c038aaff89dbd90c8e))
-   add RecordValidator ([#20](https://github.com/sapphiredev/shapeshift/issues/20)) ([8727427](https://github.com/sapphiredev/shapeshift/commit/8727427be4656792eebcdc5bddf6bcd61bc7e846))
-   add remaining string validations ([#38](https://github.com/sapphiredev/shapeshift/issues/38)) ([1c2fd7b](https://github.com/sapphiredev/shapeshift/commit/1c2fd7bbb20463f09ac461b697c312bec6ae9195))
-   add tuple ([#39](https://github.com/sapphiredev/shapeshift/issues/39)) ([b7704bf](https://github.com/sapphiredev/shapeshift/commit/b7704bf87cf5225021408cf4a6b9ceff8cba25b3))
-   added number transformers ([#17](https://github.com/sapphiredev/shapeshift/issues/17)) ([89a8ddd](https://github.com/sapphiredev/shapeshift/commit/89a8ddd8583774e68c43260c28ee1589ef44516c))
-   allow the use of module: NodeNext ([#55](https://github.com/sapphiredev/shapeshift/issues/55)) ([e6827c5](https://github.com/sapphiredev/shapeshift/commit/e6827c5a12b6a2803a137b71fe4c21bd1c35034b))
-   **array:** add array length Comparators ([#40](https://github.com/sapphiredev/shapeshift/issues/40)) ([1e564c2](https://github.com/sapphiredev/shapeshift/commit/1e564c204b6c9b0a798b3121d31dd4cc99165f60))
-   **Array:** generate tuple types with given length ([#52](https://github.com/sapphiredev/shapeshift/issues/52)) ([793648b](https://github.com/sapphiredev/shapeshift/commit/793648b4cde1f72c5b735ceebb0c48272179be06))
-   **ArrayValidator:** add length ranges ([#53](https://github.com/sapphiredev/shapeshift/issues/53)) ([e431d62](https://github.com/sapphiredev/shapeshift/commit/e431d6218b86fc1480fce14c4466cb36567cad2f))
-   display the property that errored ([#35](https://github.com/sapphiredev/shapeshift/issues/35)) ([fe188b0](https://github.com/sapphiredev/shapeshift/commit/fe188b0d17eeaa5f73b08085562903e23e91717c))
-   improve how errors are returned ([#29](https://github.com/sapphiredev/shapeshift/issues/29)) ([8bc7669](https://github.com/sapphiredev/shapeshift/commit/8bc7669a1a66a10449b321cc4447e411383977d9))
-   **s.object:** add passthrough ([#66](https://github.com/sapphiredev/shapeshift/issues/66)) ([ee9f6f3](https://github.com/sapphiredev/shapeshift/commit/ee9f6f367e513c0120a04cfafe05057c7907c327))

### Bug Fixes

-   copy/paste error and `ge` ([#22](https://github.com/sapphiredev/shapeshift/issues/22)) ([fe6505f](https://github.com/sapphiredev/shapeshift/commit/fe6505f8e698bcaf9f8024b2d8f012559827cbb0))
-   fix union type and add test ([#41](https://github.com/sapphiredev/shapeshift/issues/41)) ([fbcf8a9](https://github.com/sapphiredev/shapeshift/commit/fbcf8a9c617c16b33fdddb0a44aa0fe506164fd3))
-   **s.union:** fix union overrides ([#62](https://github.com/sapphiredev/shapeshift/issues/62)) ([56e9b19](https://github.com/sapphiredev/shapeshift/commit/56e9b1947d9b2b129dbed374671114b2242e6d35))

## 1.0.0 (2022-01-16)

### Features

-   added more primitives ([#2](https://github.com/sapphiredev/shapeshift/issues/2)) ([16af17b](https://github.com/sapphiredev/shapeshift/commit/16af17b5d9ee40dce284ee120e0b099f7b2cc0b8))
-   added more things ([7c73d82](https://github.com/sapphiredev/shapeshift/commit/7c73d82cf3740d5b2d4eebcac7767da9d3562437))
-   added ObjectValidator ([#3](https://github.com/sapphiredev/shapeshift/issues/3)) ([abe7ead](https://github.com/sapphiredev/shapeshift/commit/abe7eaddee981ef485713ff5e7b7f32ff97c645b))

### Bug Fixes

-   resolved install error ([a5abe13](https://github.com/sapphiredev/shapeshift/commit/a5abe1362bb6d9ce6d6471bffa47fe8983b0d1a4))
