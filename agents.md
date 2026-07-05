# agents.md

## 技术栈

- 构建工具：Vite。
- 前端框架：React。
- 语言：TypeScript。
- 样式：Tailwind CSS。
- 地图：Leaflet 与 react-leaflet。
- 数据源：USGS Earthquake Hazards Program GeoJSON Feed，无需 API Key。
- 数据刷新：前端轮询，默认每 60 秒刷新一次。
- 目标体验：深色科技感全球实时地震监测大屏，地图优先，统计面板与事件列表作为叠加监控层。
- 字体建议：标题使用 Chakra Petch 或同类科技感字体，正文使用 Inter、system-ui 或其他清晰无衬线字体。

## 目录约定

- `src/components`：放 React 组件。
  - 适合放地图组件、顶部状态栏、统计面板、事件列表、筛选控件、加载与错误状态组件。
- `src/hooks`：放 React hooks。
  - 适合放数据请求、自动刷新、时钟、响应式状态、地图联动等 hooks。
- `src/lib`：放纯函数工具。
  - 适合放 USGS 数据转换、震级分级、时间格式化、统计计算、筛选逻辑等纯函数。
  - `src/lib` 下的纯函数工具必须配同名 `.test.ts`。
  - 示例：`src/lib/earthquake.ts` 需要配 `src/lib/earthquake.test.ts`。
  - 示例：`src/lib/format.ts` 需要配 `src/lib/format.test.ts`。
- `src/types`：如类型较多，可集中放共享 TypeScript 类型；如果类型只服务于单个模块，优先就近放在对应文件中。
- `src/assets`：放本地静态资源。优先使用 CSS、地图瓦片和代码实现视觉效果，不随意加入大体积素材。
- `docs`：放产品文档、需求说明和实现记录。

## 命名规范与依赖规则

- React 组件文件使用 PascalCase。
  - 示例：`SeismicMap.tsx`、`StatsPanel.tsx`、`EventList.tsx`。
- hooks 使用 `use` 前缀并采用 camelCase。
  - 示例：`useEarthquakes.ts`、`useLiveClock.ts`、`useAutoRefresh.ts`。
- 纯函数工具使用 camelCase 命名导出。
  - 示例：`getMagnitudeLevel`、`formatEventTime`、`calculateStats`。
- TypeScript 类型使用 PascalCase。
  - 示例：`EarthquakeEvent`、`MagnitudeLevel`、`TimeRangeKey`。
- 常量使用清晰语义命名；跨模块共享常量可使用 SCREAMING_SNAKE_CASE。
  - 示例：`USGS_FEEDS`、`REFRESH_INTERVAL_MS`。
- CSS class 优先使用 Tailwind CSS；确实需要复杂动画、Leaflet 覆盖样式或脉冲标记样式时，再写少量全局 CSS，并保持选择器范围清晰。
- 不要擅自新增依赖，需先征求我同意。
- 如确实需要新增依赖，必须先说明：
  - 依赖名称。
  - 解决的问题。
  - 是否有不新增依赖的替代方案。
  - 对包体积、维护性和实现复杂度的影响。
- 不引入后端服务、不引入数据库、不引入需要 API Key 的数据源，除非用户后续明确确认。

## 常用命令

项目初始化完成后，默认使用以下命令：

- 启动开发服务器：`npm run dev`
- 生产构建：`npm run build`
- 运行测试：`npm run test`
- 预览生产构建：`npm run preview`

说明：

- 如果项目脚手架或测试工具尚未配置对应命令，需要先补齐 `package.json` scripts。
- 涉及新增测试依赖时，必须先征求用户同意。
- 不要静默添加不可验证的占位命令。

## 数据契约

USGS GeoJSON Feed 中，每个地震事件通常位于 `features[]` 中。应用内部需要从每个 Feature 提取并转换关键字段。

推荐接口映射：

- 过去 1 小时：`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson`
- 过去 24 小时：`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`
- 过去 7 天：`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`
- 过去 30 天：`https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson`

关键字段：

- `properties.mag`
  - 含义：地震震级。
  - 类型：通常为 `number`，也可能为 `null`。
  - 使用方式：用于点位大小、颜色分级、辉光强度、筛选、统计最大震级和平均震级。
  - 处理规则：为空或非数字时按未知震级处理，不应导致页面崩溃；未知震级不参与平均震级计算。

- `properties.place`
  - 含义：地震地点描述。
  - 类型：通常为 `string`。
  - 使用方式：用于弹窗、右侧事件列表和统计中的地点显示。
  - 处理规则：为空时显示 `Unknown location` 或等价占位文案。

- `properties.time`
  - 含义：地震发生时间。
  - 类型：Unix 时间戳，单位为毫秒。
  - 使用方式：用于事件排序、弹窗、列表展示和相对时间展示。
  - 处理规则：按时间倒序排列，最新事件在前；无效时间需要有安全兜底。

- `geometry.coordinates`
  - 含义：地震空间位置数组，格式为 `[经度, 纬度, 深度]`。
  - `coordinates[0]`：经度 longitude。
  - `coordinates[1]`：纬度 latitude。
  - `coordinates[2]`：深度 depth，通常单位为公里。
  - 使用方式：经纬度用于地图点位定位；深度用于弹窗和事件列表展示。
  - 处理规则：经纬度缺失或无效时跳过该事件，避免 Leaflet 渲染异常。

- `properties.url`
  - 含义：USGS 详情页链接。
  - 使用方式：用于弹窗或事件详情入口。
  - 处理规则：为空时不展示详情链接。

推荐应用内部事件模型：

```ts
type EarthquakeEvent = {
  id: string;
  magnitude: number | null;
  place: string;
  time: number;
  longitude: number;
  latitude: number;
  depthKm: number | null;
  detailUrl?: string;
};
```

## 工作流

- 按 `docs/PRD.md` 的实施切片推进，不跨切片大范围实现。
- 每个切片都必须做到可独立验证。
- 每个切片完成后，需要执行该切片相关验证。
- 每个切片验证通过后提交到 GitHub。
- 提交信息应能说明切片编号和完成内容。
  - 示例：`feat: complete slice 1 full-screen dark map`
- 进入下一切片前，确保当前切片有清晰提交点，并确认当前工作区干净。
- 如果下一切片出错且短时间无法修复，则回滚到上一提交，恢复到最近一次验证通过的状态。
- 回滚前需要说明：
  - 当前出错现象。
  - 已尝试的修复。
  - 准备回滚到哪个提交。
  - 将影响哪些文件或功能。
- 不回滚用户未授权的改动；如果工作区存在他人或用户改动，先识别并避免覆盖。
- 每次实现前先对照 PRD 和当前代码结构，优先沿用已有模式。
- 每次交付时说明：
  - 完成了哪个切片。
  - 用户能看到什么效果。
  - 执行了哪些验证命令。
  - 是否存在已知限制。
- 任何涉及安装依赖、初始化脚手架、启动开发服务器、提交到 GitHub、推送到 GitHub、回滚 Git 历史的命令，都需要先告诉用户将执行什么命令和原因，得到确认后再执行。
