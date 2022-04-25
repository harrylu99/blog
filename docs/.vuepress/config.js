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

            {
              title: "React Source Code",
              collapsable: true,
              children: [
                {
                  title: "Starter",
                  collapsable: true,
                  children: [
                    {
                      title: "Concept",
                      path: "/reactSourceCode/starterConcept",
                    },
                    {
                      title: "Architecture",
                      path: "/reactSourceCode/starterArchitecture",
                    },
                    {
                      title: "New Architecture",
                      path: "/reactSourceCode/starterNewArchitecture",
                    },
                    {
                      title: "File Structure",
                      path: "/reactSourceCode/starterFileStructure",
                    },
                  ],
                },
                {
                  title: "Fiber Architecture",
                  collapsable: true,
                  children: [
                    {
                      title: "Mental Model",
                      path: "/reactSourceCode/fiberMentalModel",
                    },
                    {
                      title: "Implementation",
                      path: "/reactSourceCode/fiberImplementation",
                    },
                    {
                      title: "Working Principle",
                      path: "/reactSourceCode/fiberWorkingPrinciple",
                    },
                  ],
                },
                {
                  title: "Render Stage",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/renderOverview",
                    },
                    {
                      title: "beginWork",
                      path: "/reactSourceCode/renderBeginWork",
                    },
                    {
                      title: "completeWork",
                      path: "/reactSourceCode/renderCompleteWork",
                    },
                  ],
                },
                {
                  title: "Commit Stage",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/commitOverview",
                    },
                    {
                      title: "Before Mutation",
                      path: "/reactSourceCode/commitBeforeMutation",
                    },
                    {
                      title: "Mutation",
                      path: "/reactSourceCode/commitMutation",
                    },
                    {
                      title: "Layout",
                      path: "/reactSourceCode/commitLayout",
                    },
                  ],
                },
                {
                  title: "Diff Algorithm",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/diffOverview",
                    },
                    {
                      title: "Single Node",
                      path: "/reactSourceCode/diffSingleNode",
                    },
                    {
                      title: "Multiple Node",
                      path: "/reactSourceCode/diffMultipleNode",
                    },
                  ],
                },
                {
                  title: "State",
                  collapsable: true,
                  children: [
                    {
                      title: "Overview",
                      path: "/reactSourceCode/stateOverview",
                    },
                    {
                      title: "Mental Model",
                      path: "/reactSourceCode/stateMentalModel",
                    },
                    {
                      title: "Update",
                      path: "/reactSourceCode/stateUpdate",
                    },
                    {
                      title: "Priority",
                      path: "/reactSourceCode/statePriority",
                    },
                    {
                      title: "ReactDOM.render",
                      path: "/reactSourceCode/stateReactDOM",
                    },
                    {
                      title: "this.setState",
                      path: "/reactSourceCode/stateSetState",
                    },
                  ],
                },
                {
                  title: "Hooks",
                  collapsable: true,
                  children: [
                    {
                      title: "Concept",
                      path: "/reactSourceCode/hooksConcept",
                    },
                    {
                      title: "Implement useState",
                      path: "/reactSourceCode/hooksImplementuseState",
                    },
                    {
                      title: "Data Structure",
                      path: "reactSourceCode/hooksDataStructure",
                    },
                  ],
                },
              ],
            },
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
