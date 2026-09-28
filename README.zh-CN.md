# SemigrateX

[English](README.md) | 简体中文

SemigrateX 是一个面向仓库级代码迁移的开源工作台。它希望把框架升级、依赖变更和 API 替换转化为开发者可以检查、恢复和审阅的计划与代码修改。

产品优先使用确定性的分析和转换。只有当迁移规则无法仅凭语法和类型信息判断正确改法时，才计划引入 Agent 辅助。并行 Agent 是处理独立工作单元时可选的执行方式，并不是使用该产品的前提。

> **项目状态：** 早期开发，版本 0.1.0。当前 CLI 只能生成只读的 CommonJS 到 ESM 检查计划；它不会修改文件、启动 Agent，也不能保证识别所有 CommonJS 用法。

## 当前已实现

- 使用 TypeScript 解析器扫描 JavaScript 和 TypeScript 源文件。
- 定位 `require(...)`、`module.exports`、`exports.name`、`__dirname` 和 `__filename` 语法。
- 生成带版本号的 JSON 计划，其中包含仓库相对路径以及适合编辑器使用的行号和列号。
- 提供供其他工具消费的 [版本 1 计划 JSON Schema](schemas/migration-plan.v1.schema.json)。
- 跳过依赖目录和构建产物目录，并拒绝覆盖已有的输出文件。

## 快速开始

环境要求：Node.js 22.19 或更高版本，以及 pnpm 11.7.0。

```sh
pnpm install
pnpm run build
pnpm run plan:example
```

扫描另一个仓库：

```sh
node packages/cli/dist/cli.js plan /absolute/path/to/repository
node packages/cli/dist/cli.js plan /absolute/path/to/repository --output migration-plan.json
```

不指定 `--output` 时，CLI 只向标准输出写入 JSON；指定后会创建一个新文件。当前命令始终不会修改输入仓库。

## 目标工作流

```text
检查仓库 → 规划影响范围 → 执行确定性迁移规则 → 检查剩余编译错误
         → 请求 Agent 处理歧义修改 → 人工审阅 → 提交
```

当前只实现了检查阶段。其余阶段记录在 [ROADMAP.md](ROADMAP.md) 中；[产品定义](docs/PRODUCT.md) 描述了目标用户体验和成功指标。

## 架构

初始工作区保持简单的依赖关系：

```text
@semigratex/cli → @semigratex/core → TypeScript parser
```

Core 包负责迁移数据和代码分析。未来的 DeepSeek Harness 插件、MCP Server 等运行时适配器只能依赖 Core，Core 不依赖任何 Agent Runtime。详情见 [架构说明](docs/ARCHITECTURE.md) 和 [ADR 0001](docs/decisions/0001-independent-core.md)。

## 为什么使用独立仓库

SemigrateX 是独立项目。DeepSeek Harness 是后续阶段优先接入的 Agent Runtime，但 CLI 和 Core 在没有 DeepSeek Harness 时也必须可用。因此，SemigrateX 可以独立管理发布、贡献历史和兼容性决策。

## 项目文档

- [产品定义](docs/PRODUCT.md)
- [架构与包职责](docs/ARCHITECTURE.md)
- [路线图](ROADMAP.md) 与 [当前任务](TODO.md)
- [贡献指南](CONTRIBUTING.md)
- [安全策略](SECURITY.md)
- [发布流程](docs/RELEASING.md)

## 参与贡献

仓库接受范围明确的 Issue 和 Pull Request。贡献前请阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。疑似安全漏洞请按照 [SECURITY.md](SECURITY.md) 中的私密报告方式提交。

## 许可证

[MIT](LICENSE)。Copyright © 2026 powderblueX。
