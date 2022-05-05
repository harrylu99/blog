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
      description: `🏗️ Chinese station is under construction, please go back the English station.`,
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
        lastUpdated: false, // string | boolean,
        nav: [
          { text: "Home", link: "/", icon: "reco-home" },
          {
            text: "About Me",
            link: "https://github.com/harrylu99",
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
            // JavaScript
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
                      path: "/jsBasic/about",
                    },
                    {
                      title: "Prototype and Prototype chain",
                      path: "/jsBasic/prototype",
                    },
                    {
                      title: "Scope",
                      path: "/jsBasic/scope",
                    },
                    {
                      title: "Execution Stack",
                      path: "/jsBasic/executionStack",
                    },
                    {
                      title: "Variable Object",
                      path: "/jsBasic/variableObject",
                    },
                    {
                      title: "Scope Chain",
                      path: "/jsBasic/scopeChain",
                    },
                    {
                      title: "This",
                      path: "/jsBasic/this",
                    },
                    {
                      title: "Execution Context",
                      path: "/jsBasic/executionContext",
                    },
                    {
                      title: "Closure",
                      path: "/jsBasic/closure",
                    },
                    {
                      title: "Debounce",
                      path: "/jsBasic/debounce",
                    },
                    {
                      title: "Throttle",
                      path: "/jsBasic/throttle",
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
                      path: "/jsES6/letAndConst",
                    },
                    {
                      title: "Arrow Function",
                      path: "/jsES6/arrowFunction",
                    },
                    {
                      title: "for...of",
                      path: "/jsES6/forOf",
                    },
                    {
                      title: "Promise",
                      path: "/jsES6/promise",
                    },
                    {
                      title: "Async ",
                      path: "/jsES6/async",
                    },
                  ],
                },
              ],
            },
            // React Source Code
            {
              title: "React Source Code",
              collapsable: true,
              children: [
                // Starter
                {
                  title: "Starter",
                  collapsable: true,
                  children: [
                    {
                      title: "Concept",
                      path: "/reactSourceCode/starter/concept",
                    },
                    {
                      title: "Architecture",
                      path: "/reactSourceCode/starter/architecture",
                    },
                    {
                      title: "New Architecture",
                      path: "/reactSourceCode/starter/newArchitecture",
                    },
                    {
                      title: "File Structure",
                      path: "/reactSourceCode/starter/fileStructure",
                    },
                  ],
                },
                // Fiber Architecture
                {
                  title: "Fiber Architecture",
                  collapsable: true,
                  children: [
                    {
                      title: "Mental Model",
                      path: "/reactSourceCode/fiber/mentalModel",
                    },
                    {
                      title: "Implementation",
                      path: "/reactSourceCode/fiber/implementation",
                    },
                    {
                      title: "Working Principle",
                      path: "/reactSourceCode/fiber/workingPrinciple",
                    },
                  ],
                },
                // Render Stage
                {
                  title: "Render Stage",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/render/overview",
                    },
                    {
                      title: "beginWork",
                      path: "/reactSourceCode/render/beginWork",
                    },
                    {
                      title: "completeWork",
                      path: "/reactSourceCode/render/completeWork",
                    },
                  ],
                },
                // Commit Stage
                {
                  title: "Commit Stage",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/commit/overview",
                    },
                    {
                      title: "Before Mutation",
                      path: "/reactSourceCode/commit/beforeMutation",
                    },
                    {
                      title: "Mutation",
                      path: "/reactSourceCode/commit/mutation",
                    },
                    {
                      title: "Layout",
                      path: "/reactSourceCode/commit/layout",
                    },
                  ],
                },
                // Diff Algorithm
                {
                  title: "Diff Algorithm",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/diff/overview",
                    },
                    {
                      title: "Single Node",
                      path: "/reactSourceCode/diff/singleNode",
                    },
                    {
                      title: "Multiple Node",
                      path: "/reactSourceCode/diff/multipleNode",
                    },
                  ],
                },
                // State
                {
                  title: "State",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/state/overview",
                    },
                    {
                      title: "Mental Model",
                      path: "/reactSourceCode/state/mentalModel",
                    },
                    {
                      title: "Update",
                      path: "/reactSourceCode/state/update",
                    },
                    {
                      title: "Priority",
                      path: "/reactSourceCode/state/priority",
                    },
                    {
                      title: "ReactDOM.render",
                      path: "/reactSourceCode/state/reactDOM",
                    },
                    {
                      title: "this.setState",
                      path: "/reactSourceCode/state/setState",
                    },
                  ],
                },
                // Hooks
                {
                  title: "Hooks",
                  collapsable: true,
                  children: [
                    {
                      title: "Concept",
                      path: "/reactSourceCode/hooks/concept",
                    },
                    {
                      title: "Implement useState",
                      path: "/reactSourceCode/hooks/implementuseState",
                    },
                    {
                      title: "Data Structure",
                      path: "reactSourceCode/hooks/dataStructure",
                    },
                    {
                      title: "useState and useReducer",
                      path: "/reactSourceCode/hooks/useStateAndUseReducer",
                    },
                    {
                      title: "useEffect",
                      path: "/reactSourceCode/hooks/useEffect",
                    },
                    {
                      title: "useRef",
                      path: "/reactSourceCode/hooks/useRef",
                    },
                    {
                      title: "useMemo and useCallback",
                      path: "/reactSourceCode/hooks/useMemoAndUseCallback",
                    },
                  ],
                },
              ],
            },
            // BackEnd
            {
              title: "BackEnd",
              collapsable: true,
              children: [
                // BackEnd Basic
                {
                  title: "BackEnd Basic",
                  collapsable: true,
                  children: [
                    {
                      title: "Notes",
                      path: "/backEndBasic/notes",
                    },
                    {
                      title: "ORM",
                      path: "/backEndBasic/ORM",
                    },
                    {
                      title: ".Net MVC",
                      path: "/backEndBasic/MVC",
                    },
                  ],
                },
                // C#
                {
                  title: "C# Basic",
                  collapsable: true,
                  children: [
                    {
                      title: "About C#",
                      path: "/cSharpBasic/about",
                    },
                    {
                      title: "Structure and Data Type",
                      path: "/cSharpBasic/structureAndDataType",
                    },
                    {
                      title: "Method",
                      path: "/cSharpBasic/method",
                    },
                    {
                      title: "Nullable",
                      path: "/cSharpBasic/nullable",
                    },
                    {
                      title: "Struct",
                      path: "/cSharpBasic/struct",
                    },
                    {
                      title: "Class",
                      path: "/cSharpBasic/class",
                    },
                    {
                      title: "Inheritance",
                      path: "cSharpBasic/inheritance",
                    },
                    {
                      title: "Polymorphism",
                      path: "cSharpBasic/polymorphism",
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
        lastUpdated: false, // string | boolean,
        nav: [
          { text: "Home", link: "/zh" },
          {
            text: "关于我",
            link: "https://github.com/harrylu99",
            icon: "reco-github",
          },
        ],
      },
    },
  },
};
