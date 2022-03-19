module.exports = {
  title: `Harry's Blog`,
  description: "Almost there...",
  base: "/blog/",
  locales: {
    "/": {
      lang: "en-US",
      title: `Harry's Blog`,
      description: ` 👨‍💻console.log( ) `,
    },
    "/zh/": {
      lang: "zh-CN",
      title: "个人博客",
      description: "个人博客",
    },
  },
  plugins: [],
  theme: "reco",
  themeConfig: {
    subSidebar: "auto",
    noFoundPageByTencent: false,
    author: "Harry Lu",
    startYear: "2022",
    locales: {
      "/": {
        selectText: "Languages",
        label: "English",
        ariaLabel: "Languages",
        editLinkText: "Edit this page on GitHub",
        serviceWorker: {
          updatePopup: {
            message: "New content is available.",
            buttonText: "Refresh",
          },
        },
        algolia: {},
        lastUpdated: "Last Updated", // string | boolean,
        nav: [
          { text: "Home", link: "/" },
          {
            text: "My Site",
            link: "https://harrylu99.github.io",
            icon: "reco-coding",
          },
          // { text: 'Suggestion', link: 'https://harrylu99.github.io', icon: 'reco-suggestion' },
        ],
        sidebar: {
          "/": [
            {
              title: "👨‍💻 About this blog",
              path: "/",
              collapsable: false,
            },
            {
              title: "JavaScript",
              collapsable: true,
              children: [
                // Basic
                {
                  title: "Basic",
                  collapsable: true,
                  children: [
                    {
                      title: "About JavaScript",
                      path: "/jsBasic/About",
                    },
                    {
                      title: "Prototype and Prototype chain",
                      path: "/jsBasic/Prototype",
                    },
                    {
                      title: "Scope",
                      path: "/jsBasic/Scope",
                    },
                    {
                      title: "Execution Stack",
                      path: "/jsBasic/ExecutionStack",
                    },
                    {
                      title: "Variable Object",
                      path: "/jsBasic/VariableObject",
                    },
                    {
                      title: "Scope Chain",
                      path: "/jsBasic/ScopeChain",
                    },
                    {
                      title: "This",
                      path: "/jsBasic/This",
                    },
                    {
                      title: "Execution Context",
                      path: "/jsBasic/ExecutionContext",
                    },
                    {
                      title: "Closure",
                      path: "/jsBasic/Closure",
                    },
                    {
                      title: "Debounce",
                      path: "/jsBasic/Debounce",
                    },
                    {
                      title: "Throttle",
                      path: "/jsBasic/Throttle",
                    },
                  ],
                },
                // ES6
                {
                  title: "ES6",
                  collapsable: true,
                  children: [
                    {
                      title: "Let and Const",
                      path: "/jsES6/LetAndConst",
                    },
                    {
                      title: "Arrow Function",
                      path: "/jsES6/ArrowFunction",
                    },
                    {
                      title: "for...of",
                      path: "/jsES6/ForOf",
                    },
                    {
                      title: "Promise",
                      path: "/jsES6/Promise",
                    },
                    {
                      title: "Async ",
                      path: "/jsES6/Async",
                    },
                  ],
                },
              ],
            },

            {
              title: "React",
              collapsable: true,
              children: [
                // Source Code
                {
                  title: "Source Code",
                  collapsable: true,
                  children: [
                    { title: "Concept", path: "/reactSourceCode/Concept" },
                    {
                      title: "Architecture",
                      path: "/reactSourceCode/Architecture",
                    },
                    {
                      title: "New Architecture",
                      path: "/reactSourceCode/NewArchitecture",
                    },
                    {
                      title: "Fiber - Mental Model",
                      path: "/reactSourceCode/FiberMentalModel",
                    },
                    {
                      title: "Fiber - Implementation",
                      path: "/reactSourceCode/FiberImplementation",
                    },
                    {
                      title: "Fiber - Working Principle",
                      path: "/reactSourceCode/FiberWorkingPrinciple",
                    },
                  ],
                },
              ],
            },

            {
              title: "Vue",
              collapsable: true,
              children: [
                {
                  title: "About Vue",
                  path: "/vue/About",
                },
              ],
            },

            {
              title: "BackEnd",
              collapsable: true,
              children: [
                // C#
                {
                  title: "C# Basic",
                  collapsable: true,
                  children: [
                    {
                      title: "About C#",
                      path: "/cSharpBasic/About",
                    },
                    {
                      title: "Structure and Data Type",
                      path: "/cSharpBasic/StructureAndDataType",
                    },
                    {
                      title: "Method",
                      path: "/cSharpBasic/Method",
                    },
                    {
                      title: "Nullable",
                      path: "/cSharpBasic/Nullable",
                    },
                    {
                      title: "Struct",
                      path: "/cSharpBasic/Struct",
                    },
                    {
                      title: "Class",
                      path: "/cSharpBasic/Class",
                    },
                  ],
                },
                // ASP.NET
                {
                  title: "ASP.NET",
                  collapsable: true,
                  children: [
                    {
                      title: "About ASP.NET",
                      path: "/ASP.NET/About",
                    },
                  ],
                },
              ],
            },
          ],
        },
      },

      "/zh/": {
        // 多语言下拉菜单的标题
        selectText: "选择语言",
        // 该语言在下拉菜单中的标签
        label: "简体中文",
        // 编辑链接文字
        editLinkText: "在 GitHub 上编辑此页",
        // Service Worker 的配置
        serviceWorker: {
          updatePopup: {
            message: "发现新内容可用.",
            buttonText: "刷新",
          },
        },
        // 当前 locale 的 algolia docsearch 选项
        algolia: {},
        lastUpdated: "最后更新", // string | boolean,
        nav: [
          { text: "Home", link: "/zh" },
          {
            text: "GitHub",
            link: "https://github.com/harrylu99",
            icon: "reco-github",
          },
        ],
        sidebar: {
          "/zh/": [
            {
              title: "关于博客",
              path: "/zh/",
              collapsable: false,
            },
            {
              title: "JavaScript",
              collapsable: true,
              children: [{ title: "About JavaScript", path: "/zh/js/About" }],
            },
            {
              title: "React",
              collapsable: true,
              children: [{ title: "About React", path: "/zh/react/About" }],
            },
            {
              title: "Vue",
              collapsable: true,
              children: [{ title: "About Vue", path: "/zh/vue/About" }],
            },
          ],
        },
      },
    },
  },
};
