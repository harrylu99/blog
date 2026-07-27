#!/usr/bin/env node
/**
 * Patch script for vuepress-theme-reco@2.0.0-rc.26 + vuepress@2.0.0-rc.19
 * Fixes Vite dev mode define variable issues and PageCreater hardcoded 'blogs/' regex.
 * Run: node patch-reco.js
 */

const fs = require('fs');
const path = require('path');

const patches = [
  // 1. Fix __VUEPRESS_SSR__ in .vue files
  {
    file: 'node_modules/vuepress-theme-reco/lib/client/components/Home/Blog.vue',
    replacements: [
      ['if (!__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ === \'undefined\' || !__VUEPRESS_SSR__) {'],
    ]
  },
  {
    file: 'node_modules/vuepress-theme-reco/lib/client/components/Posts.vue',
    replacements: [
      ['if (!__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ === \'undefined\' || !__VUEPRESS_SSR__) {'],
    ]
  },

  // 2. Fix __VUEPRESS_SSR__ in .js files
  {
    file: 'node_modules/vuepress-theme-reco/lib/client/components/Page/hook.js',
    replacements: [
      ['if (!__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ === \'undefined\' || !__VUEPRESS_SSR__) {'],
    ]
  },
  {
    file: 'node_modules/vuepress-theme-reco/lib/client/components/GenericContainer/usePassword.js',
    replacements: [
      ['if (!__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ === \'undefined\' || !__VUEPRESS_SSR__) {'],
    ]
  },
  {
    file: 'node_modules/@vuepress-reco/vuepress-plugin-bulletin-popover/lib/client/config.js',
    replacements: [
      ['if (__VUEPRESS_SSR__)', 'if (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
    ]
  },
  {
    file: 'node_modules/@vuepress-reco/vuepress-plugin-comments/lib/client/components/Valine.js',
    replacements: [
      ['if (__VUEPRESS_SSR__)', 'if (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
    ]
  },

  // 3. Fix __POSTS__ etc. in clientSetup.js
  {
    file: 'node_modules/@vuepress-reco/vuepress-plugin-page/lib/client/clientSetup.js',
    replacements: [
      ['const posts = __POSTS__;', 'const posts = typeof __POSTS__ !== \'undefined\' ? __POSTS__ : [];'],
      ['const series = __SERIES__;', 'const series = typeof __SERIES__ !== \'undefined\' ? __SERIES__ : {};'],
      ['const categorySummary = __CATEGORY_SUMMARY__;', 'const categorySummary = typeof __CATEGORY_SUMMARY__ !== \'undefined\' ? __CATEGORY_SUMMARY__ : [];'],
      ['const categoryPosts = __CATEGORY_PAGINATION_POSTS__;', 'const categoryPosts = typeof __CATEGORY_PAGINATION_POSTS__ !== \'undefined\' ? __CATEGORY_PAGINATION_POSTS__ : [];'],
    ]
  },

  // 4. Fix @vuepress/client/dist/app.js (top-level)
  {
    file: 'node_modules/@vuepress/client/dist/app.js',
    replacements: [
      ['var historyCreator = __VUEPRESS_SSR__ ? createMemoryHistory : createWebHistory;',
       'var historyCreator = (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__) ? createMemoryHistory : createWebHistory;'],
      ['  if (__VUEPRESS_SSR__) {', '  if (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__) {'],
      ['if (!__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ === \'undefined\' || !__VUEPRESS_SSR__) {'],
    ]
  },

  // 5. Fix @vuepress/client/dist/app.js (nested in reco theme)
  {
    file: 'node_modules/vuepress-theme-reco/node_modules/@vuepress/client/dist/app.js',
    replacements: [
      ['var historyCreator = __VUEPRESS_SSR__ ? createMemoryHistory : createWebHistory;',
       'var historyCreator = (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__) ? createMemoryHistory : createWebHistory;'],
      ['  if (__VUEPRESS_SSR__) {', '  if (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__) {'],
      ['if (!__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ === \'undefined\' || !__VUEPRESS_SSR__) {'],
    ]
  },

  // 6. Fix @vuepress/plugin-medium-zoom
  {
    file: 'node_modules/@vuepress/plugin-medium-zoom/lib/client/composables/useMediumZoom.js',
    replacements: [
      ['if (__VUEPRESS_SSR__) {', 'if (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__) {'],
    ]
  },
  {
    file: 'node_modules/@vuepress/plugin-medium-zoom/lib/client/config.js',
    replacements: [
      ['const selector = __MZ_SELECTOR__;', 'const selector = typeof __MZ_SELECTOR__ !== \'undefined\' ? __MZ_SELECTOR__ : \'.theme-default-content img\';'],
      ['const zoomOptions = __MZ_ZOOM_OPTIONS__;', 'const zoomOptions = typeof __MZ_ZOOM_OPTIONS__ !== \'undefined\' ? __MZ_ZOOM_OPTIONS__ : {};'],
      ['const delay = __MZ_DELAY__;', 'const delay = typeof __MZ_DELAY__ !== \'undefined\' ? __MZ_DELAY__ : 500;'],
      ['if (__VUEPRESS_SSR__ || !selector)', 'if ((typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__) || !selector)'],
    ]
  },

  // 7. Fix @vuepress/helper
  {
    file: 'node_modules/@vuepress/helper/lib/client/utils/data.js',
    replacements: [
      ['return __VUEPRESS_SSR__', 'return (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
      ['const binary = __VUEPRESS_SSR__', 'const binary = (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
    ]
  },
  {
    file: 'node_modules/@vuepress/plugin-prismjs/node_modules/@vuepress/helper/lib/client/utils/data.js',
    replacements: [
      ['return __VUEPRESS_SSR__', 'return (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
      ['const binary = __VUEPRESS_SSR__', 'const binary = (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
    ]
  },

  // 8. Fix @vuepress/plugin-active-header-links
  {
    file: 'node_modules/@vuepress/plugin-active-header-links/lib/client/config.js',
    replacements: [
      ['const headerLinkSelector = __AHL_HEADER_LINK_SELECTOR__;', 'const headerLinkSelector = typeof __AHL_HEADER_LINK_SELECTOR__ !== \'undefined\' ? __AHL_HEADER_LINK_SELECTOR__ : \'a.sidebar-item\';'],
      ['const headerAnchorSelector = __AHL_HEADER_ANCHOR_SELECTOR__;', 'const headerAnchorSelector = typeof __AHL_HEADER_ANCHOR_SELECTOR__ !== \'undefined\' ? __AHL_HEADER_ANCHOR_SELECTOR__ : \'.header-anchor\';'],
      ['const delay = __AHL_DELAY__;', 'const delay = typeof __AHL_DELAY__ !== \'undefined\' ? __AHL_DELAY__ : 0;'],
      ['const offset = __AHL_OFFSET__;', 'const offset = typeof __AHL_OFFSET__ !== \'undefined\' ? __AHL_OFFSET__ : 0;'],
      ['if (__VUEPRESS_SSR__)', 'if (typeof __VUEPRESS_SSR__ !== \'undefined\' && __VUEPRESS_SSR__)'],
    ]
  },

  // 9. Fix PageCreater hardcoded 'blogs/' to 'posts/'
  // Use simple string replacement for 'blogs/' in regex patterns (more robust than exact regex match)
  {
    file: 'node_modules/@vuepress-reco/vuepress-plugin-page/lib/node/PageCreater.js',
    replacements: [
      ['\\/blogs\\/', '\\/posts\\/'],
      // Map 'CSharp' label → 'C#' for display (URL slug stays CSharp)
      // First occurrence (reduce, 28-space indent)
      ['pages: [page],\n                            label: categoryValue,', 'pages: [page],\n                            label: categoryValue === \'CSharp\' ? \'C#\' : categoryValue,'],
      // Second occurrence (forEach, 32-space indent)
      ['pages: [page],\n                                label: categoryValue,', 'pages: [page],\n                                label: categoryValue === \'CSharp\' ? \'C#\' : categoryValue,'],
    ]
  },

  // 11. Fix PageInfo.vue — map CSharp → C# in article page category tags
  {
    file: 'node_modules/vuepress-theme-reco/lib/client/components/PageInfo.vue',
    replacements: [
      ['label: category,', 'label: category === \'CSharp\' ? \'C#\' : category,'],
    ]
  },

  // 10. Fix Features.vue to support link attribute
  {
    file: 'node_modules/vuepress-theme-reco/lib/client/components/Home/Features.vue',
    replacements: [
      ['<template>\n  <div class="features__container">\n    <MagicCard\n      class="features__item"\n      v-for="(item, index) in data"\n      :key="index"\n    >\n      <h4>{{ item.title }}</h4>\n      <p>{{ item.details }}</p>\n    </MagicCard>\n  </div>\n</template>',
       '<template>\n  <div class="features__container">\n    <a\n      v-for="(item, index) in data"\n      :key="index"\n      :href="item.link ? withBase(item.link) : undefined"\n      class="features__link"\n      :class="{ \'features__link--disabled\': !item.link }"\n    >\n      <MagicCard class="features__item">\n        <h4>{{ item.title }}</h4>\n        <p>{{ item.details }}</p>\n      </MagicCard>\n    </a>\n  </div>\n</template>'],
      ['import { usePageFrontmatter } from \'vuepress/client\'', 'import { usePageFrontmatter, withBase } from \'vuepress/client\''],
      ['Array<{ title: string, details: string }>', 'Array<{ title: string, details: string, link?: string }>'],
    ]
  },
];

let patchCount = 0;
for (const { file, replacements } of patches) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`[SKIP] File not found: ${file}`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  for (const [oldStr, newStr] of replacements) {
    if (content.includes(newStr)) continue; // already patched
    if (content.includes(oldStr)) {
      content = content.replace(oldStr, newStr);
      modified = true;
    }
  }
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    patchCount++;
    console.log(`[PATCH] ${file}`);
  } else {
    console.log(`[OK] ${file}`);
  }
}

console.log(`\nPatched ${patchCount} file(s).`);
