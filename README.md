# G6VP Assets for TuGraph-DB

## Development

- clone G6VP Repo

```bash
git clone https://github.com/antvis/G6VP.git
cd G6VP
pnpm install
```

- link gi-assets-tugraph-db

```bash
git clone https://github.com/TuGraph-family/gi-assets-tugraph-db.git

# current path
pwd

cd /G6VP/packages/gi-site

pnpm run link /User/YourPath/xxx/xxx/gi-assets-tugraph-db GI_ASSETS_TUGRAPH_DB

```

- devlop tugraph-db assets

```bash
cd /G6VP/packages/gi-assets-tugraph-db

npm run start

cd /G6VP/packages/gi-site

npm run start

```

Notice ⚠️：Please do not submit the following three files:

```bash
G6VP/pacakges/gi-site/src/pacakge.json
G6VP/pacakges/gi-site/src/services/inject.ts
G6VP/pnpm-lock.yaml
```

## custom icon

view `src/index.tsx`

```jsx
// https://www.iconfont.cn/manage/index?spm=a313x.home_index.i3.23.58a33a81XuFfCN&manage_type=myprojects&projectId=3146710&keyword=&project_type=&page=

const icons = ['font_3146710_kr2gi7k0et'];

export { components, deploys, icons, services, templates };
```
