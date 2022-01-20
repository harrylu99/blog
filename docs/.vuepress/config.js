
module.exports = {
    title: `Harry's Blog`,
    description: 'Almost there...',
    base: '/blog/',
    locales: {
        '/': {
            lang: 'en-US',
            title: `Harry's Blog`,
            description: ` 👨‍💻console.log( ) `,
        },
        '/zh/': {
            lang: 'zh-CN',
            title: '个人博客',
            description: '个人博客',
        }
    },
    theme: 'reco',
    themeConfig: {
        subSidebar: 'auto',
        noFoundPageByTencent: false,
        author: 'Harry Lu',
        startYear: '2022',
        locales: {
            '/': {
                selectText: 'Languages',
                label: 'English',
                ariaLabel: 'Languages',
                editLinkText: 'Edit this page on GitHub',
                serviceWorker: {
                    updatePopup: {
                        message: "New content is available.",
                        buttonText: "Refresh"
                    }
                },
                algolia: {},
                lastUpdated: 'Last Updated', // string | boolean,
                nav: [
                    { text: 'Home', link: '/' },
                    { text: 'GitHub', link: 'https://github.com/harrylu99', icon: 'reco-github' },
                ],
                sidebar: {
                    '/': [
                        {
                            title: "About this blog",
                            path: '/',
                            collapsable: false,
                        },
                        {
                            title: "JavaScript",
                            collapsable: true,
                            children: [
                                { title: "About JavaScript", path: "/js/About" },
                                { title: "Prototype and Prototypr chain", path: "/js/Prototype" },
                                { title: "Scope", path: "/js/Scope" },
                                { title: "Execution Stack", path: "js/ExecutionStack" },
                                { title: "Variable Object", path: "/js/VariableObject" },
                                { title: "Scope Chain", path: "/js/ScopeChain" },
                                { title: "This", path: "/js/This" },
                            ]
                        },
                        {
                            title: "Vue",
                            collapsable: true,
                            children: [
                                { title: "About Vue", path: "/vue/About" },
                            ]
                        },
                        {
                            title: "React",
                            collapsable: true,
                            children: [
                                { title: "About React", path: "/react/About" },
                            ]
                        }],
                }
            },
            '/zh/': {
                // 多语言下拉菜单的标题
                selectText: '选择语言',
                // 该语言在下拉菜单中的标签
                label: '简体中文',
                // 编辑链接文字
                editLinkText: '在 GitHub 上编辑此页',
                // Service Worker 的配置
                serviceWorker: {
                    updatePopup: {
                        message: "发现新内容可用.",
                        buttonText: "刷新"
                    }
                },
                // 当前 locale 的 algolia docsearch 选项
                algolia: {},
                lastUpdated: '最后更新', // string | boolean,
                nav: [
                    { text: '首页', link: '/zh/' },
                    {
                        text: '更多',
                        items: [
                            { text: 'Github', link: 'https://github.com/luyao99' }
                        ]
                    }
                ],
                sidebar: {
                    '/zh/': [{
                        title: "关于",
                        path: '/zh/',
                        collapsable: false,
                    }, {
                        title: "JavaScript",
                        path: '/zh/js/',
                        collapsable: true,
                    },
                    {
                        title: "Vue",
                        path: '/zh/vue/',
                        collapsable: true,
                    },
                    {
                        title: "React",
                        path: '/zh/react/',
                        collapsable: true,
                    }],

                }
            }
        }
    }
}