#!/usr/bin/env python3
"""Post-install patches for vuepress-theme-reco 2.0.1-alpha.32 compatibility with VuePress rc.x."""

import os

BASE = os.path.dirname(os.path.abspath(__file__))

# Patch 1: Fix styleDefault.js bundler override
style_default = os.path.join(BASE, 'node_modules/@vuepress-reco/style-default/lib/node/styleDefault.js')
if os.path.exists(style_default):
    with open(style_default, 'r') as f:
        content = f.read()
    
    if "app.options.bundler = '@vuepress/bundler-webpack'" in content:
        content = content.replace(
            "app.options.bundler = '@vuepress/bundler-webpack';",
            "// PATCHED: removed bundler string override for rc.x"
        )
        content = content.replace(
            "if (bundler === '@vuepress/bundler-vite') {",
            "if (bundler && bundler.name === '@vuepress/bundler-vite') {"
        )
        content = content.replace(
            "const { bundler, bundlerConfig } = app.options || {};",
            "const { bundlerConfig } = app.options || {};\n        const bundler = app.options.bundler;"
        )
        with open(style_default, 'w') as f:
            f.write(content)
        print("[patch] Fixed styleDefault.js bundler compatibility")

# Patch 2: Fix page-plugin define variables for Vite dev mode
client_app = os.path.join(BASE, 'node_modules/@vuepress-reco/vuepress-plugin-page/lib/client/clientAppEnhance.js')
if os.path.exists(client_app) and 'typeof CLASSIFICATION_PAGINATION_POSTS' not in open(client_app).read():
    with open(client_app, 'r') as f:
        content = f.read()
    content = content.replace(
        'const a = CLASSIFICATION_PAGINATION_POSTS;',
        'const a = typeof CLASSIFICATION_PAGINATION_POSTS !== "undefined" ? CLASSIFICATION_PAGINATION_POSTS : {};'
    )
    content = content.replace(
        'const b = POSTS;',
        'const b = typeof POSTS !== "undefined" ? POSTS : [];'
    )
    content = content.replace(
        'const c = CLASSIFICATION_SUMMARY;',
        'const c = typeof CLASSIFICATION_SUMMARY !== "undefined" ? CLASSIFICATION_SUMMARY : {};'
    )
    with open(client_app, 'w') as f:
        f.write(content)
    print("[patch] Fixed page-plugin clientAppEnhance.js define variables")

use_page_data = os.path.join(BASE, 'node_modules/@vuepress-reco/vuepress-plugin-page/lib/client/composable/usePageData.js')
if os.path.exists(use_page_data) and 'typeof __VUEPRESS_DEV__' not in open(use_page_data).read():
    with open(use_page_data, 'r') as f:
        content = f.read()
    content = content.replace(
        "__VUEPRESS_DEV__",
        "(typeof __VUEPRESS_DEV__ !== 'undefined' ? __VUEPRESS_DEV__ : true)"
    )
    with open(use_page_data, 'w') as f:
        f.write(content)
    print("[patch] Fixed page-plugin usePageData.js __VUEPRESS_DEV__")

print("[patch] All compatibility patches applied.")
