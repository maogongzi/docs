import fs from 'fs'
import path from 'path'
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'
import baseConfig from '@vue/theme/config'
import { headerPlugin } from './headerMdPlugin'

const nav = [
  {
    text: 'Aprender',
    activeMatch: `^/(guide|style-guide|cookbook|examples)/`,
    items: [
      {
        text: 'Guía',
        link: '/guide/introduction'
      },
      {
        text: 'Tutorial',
        link: '/tutorial/'
      },
      {
        text: 'Ejemplos',
        link: '/examples/'
      },
      {
        text: 'Inicio Rápido',
        link: '/guide/quick-start'
      },
      {
        text: 'Guía de Estilo',
        link: '/style-guide/'
      },
      {
        text: 'Migrando desde Vue 2',
        link: 'https://v3-migration.vuejs.org/'
      }
    ]
  },
  {
    text: 'API',
    activeMatch: `^/api/`,
    link: '/api/'
  },
  {
    text: 'Patio de Juego',
    link: 'https://sfc.vuejs.org'
  },
  {
    text: 'Ecosistema',
    activeMatch: `^/ecosystem/`,
    items: [
      {
        text: 'Recursos',
        items: [
          {
            text: 'Socios',
            link: '/ecosystem/partners'
          },
          {
            text: 'Temas',
            link: '/ecosystem/themes'
          },
          {
            text: 'Empleos',
            link: 'https://vuejobs.com/?ref=vuejs'
          },
          {
            text: 'Tienda de Camisetas',
            link: 'https://vue.threadless.com/'
          }
        ]
      },
      {
        text: 'Cursos en Video',
        items: [
          {
            text: 'Vue Mastery',
            link: 'https://www.vuemastery.com/courses/'
          },
          {
            text: 'Vue School',
            link: 'https://vueschool.io/?friend=vuejs&utm_source=Vuejs.org&utm_medium=Link&utm_content=Navbar%20Dropdown'
          }
        ]
      },
      {
        text: 'Ayuda',
        items: [
          {
            text: 'Chat de Discord',
            link: 'https://discord.com/invite/HBherRA'
          },
          {
            text: 'Foro',
            link: 'https://forum.vuejs.org/'
          },
          {
            text: 'Comunidad en DEV',
            link: 'https://dev.to/t/vue'
          }
        ]
      },
      {
        text: 'Noticias',
        items: [
          {
            text: 'Blog',
            link: 'https://blog.vuejs.org/'
          },
          {
            text: 'Twitter',
            link: 'https://twitter.com/vuejs'
          },
          {
            text: 'Boletín',
            link: 'https://news.vuejs.org/'
          },
          {
            text: 'Eventos',
            link: 'https://events.vuejs.org/'
          }
        ]
      }
    ]
  },
  {
    text: 'Acerca de',
    activeMatch: `^/about/`,
    items: [
      { text: 'FAQ', link: '/about/faq' },
      { text: 'Equipo', link: '/about/team' },
      { text: 'Lanzamientos', link: '/about/releases' },
      {
        text: 'Guía de la Comunidad',
        link: '/about/community-guide'
      },
      {
        text: 'Código de Conducta',
        link: '/about/coc'
      },
      {
        text: 'El Documental',
        link: 'https://www.youtube.com/watch?v=OrxmtDw4pVI'
      }
    ]
  },
  {
    text: 'Patrocinador',
    link: '/sponsor/'
  }
]

export const sidebar = {
  '/guide/': [
    {
      text: 'Empezando',
      items: [
        {
          text: 'Introducción',
          link: '/guide/introduction'
        },
        {
          text: 'Inicio Rápido',
          link: '/guide/quick-start'
        }
      ]
    },
    {
      text: 'Esenciales',
      items: [
        {
          text: 'Creando una Aplicación',
          link: '/guide/essentials/application'
        },
        {
          text: 'Sintaxis de la Template',
          link: '/guide/essentials/template-syntax'
        },
        {
          text: 'Fundamentos de Reactividad',
          link: '/guide/essentials/reactivity-fundamentals'
        },
        {
          text: 'Propiedades Computadas',
          link: '/guide/essentials/computed'
        },
        {
          text: 'Enlaces de Clase y Estilo',
          link: '/guide/essentials/class-and-style'
        },
        {
          text: 'Renderizado Condicional',
          link: '/guide/essentials/conditional'
        },
        {
          text: 'Renderizado de Lista',
          link: '/guide/essentials/list'
        },
        {
          text: 'Manejo de Eventos',
          link: '/guide/essentials/event-handling'
        },
        {
          text: 'Enlaces de Formularios',
          link: '/guide/essentials/forms'
        },
        {
          text: 'Ciclo de Vida de los Hooks',
          link: '/guide/essentials/lifecycle'
        },
        {
          text: 'Watchers',
          link: '/guide/essentials/watchers'
        },
        {
          text: 'Referencias de la Template',
          link: '/guide/essentials/template-refs'
        },
        {
          text: 'Básicos de Componentes',
          link: '/guide/essentials/component-basics'
        }
      ]
    },
    {
      text: 'Componentes en Profundidad',
      items: [
        {
          text: 'Registro',
          link: '/guide/components/registration'
        },
        {
          text: 'Props',
          link: '/guide/components/props'
        },
        {
          text: 'Eventos',
          link: '/guide/components/events'
        },
        {
          text: 'Fallthrough',
          link: '/guide/components/attrs'
        },
        {
          text: 'Slots',
          link: '/guide/components/slots'
        },
        {
          text: 'Proveer / Inyectar',
          link: '/guide/components/provide-inject'
        },
        {
          text: 'Componentes Asíncronos',
          link: '/guide/components/async'
        }
      ]
    },
    {
      text: 'Reusabilidad',
      items: [
        {
          text: 'Composables',
          link: '/guide/reusability/composables'
        },
        {
          text: 'Directivas Personalizadas',
          link: '/guide/reusability/custom-directives'
        },
        {
          text: 'Plugins',
          link: '/guide/reusability/plugins'
        }
      ]
    },
    {
      text: 'Componentes Integrados',
      items: [
        {
          text: 'Transition',
          link: '/guide/built-ins/transition'
        },
        {
          text: 'TransitionGroup',
          link: '/guide/built-ins/transition-group'
        },
        {
          text: 'KeepAlive',
          link: '/guide/built-ins/keep-alive'
        },
        {
          text: 'Teleport',
          link: '/guide/built-ins/teleport'
        },
        {
          text: 'Suspense',
          link: '/guide/built-ins/suspense'
        }
      ]
    },
    {
      text: 'Escalando la Aplicación',
      items: [
        {
          text: 'Componentes de un Solo Archivo (SFC)',
          link: '/guide/scaling-up/sfc'
        },
        {
          text: 'Herramientas',
          link: '/guide/scaling-up/tooling'
        },
        {
          text: 'Enrutamiento',
          link: '/guide/scaling-up/routing'
        },
        {
          text: 'Manejo del Estado',
          link: '/guide/scaling-up/state-management'
        },
        {
          text: 'Testing',
          link: '/guide/scaling-up/testing'
        },
        {
          text: 'Renderizado del Lado del Servidor (SSR)',
          link: '/guide/scaling-up/ssr'
        }
      ]
    },
    {
      text: 'Mejores Prácticas',
      items: [
        {
          text: 'Implementación de Producción (Deployment)',
          link: '/guide/best-practices/production-deployment'
        },
        {
          text: 'Guía de Optimización del Rendimiento',
          link: '/guide/best-practices/performance'
        },
        {
          text: 'Accesibilidad',
          link: '/guide/best-practices/accessibility'
        },
        {
          text: 'Seguridad',
          link: '/guide/best-practices/security'
        }
      ]
    },
    {
      text: 'TypeScript',
      items: [
        {
          text: 'Descripción General',
          link: '/guide/typescript/overview'
        },
        {
          text: 'TS con la Composition API',
          link: '/guide/typescript/composition-api'
        },
        {
          text: 'TS con la Options API',
          link: '/guide/typescript/options-api'
        }
      ]
    },
    {
      text: 'Temas Adicionales',
      items: [
        {
          text: 'Formas de Usar Vue',
          link: '/guide/extras/ways-of-using-vue'
        },
        {
          text: 'FAQ de la Composition API',
          link: '/guide/extras/composition-api-faq'
        },
        {
          text: 'Reactividad en Profundidad',
          link: '/guide/extras/reactivity-in-depth'
        },
        {
          text: 'Mecanismo de Renderizado',
          link: '/guide/extras/rendering-mechanism'
        },
        {
          text: 'Funciones de Renderizado y JSX',
          link: '/guide/extras/render-function'
        },
        {
          text: 'Vue y Componentes Web',
          link: '/guide/extras/web-components'
        },
        {
          text: 'Técnicas de Animación',
          link: '/guide/extras/animation'
        },
        {
          text: 'Transformación de la Reactividad',
          link: '/guide/extras/reactivity-transform'
        }
        // {
        //   text: 'Construyendo una Biblioteca para Vue',
        //   link: '/guide/extras/building-a-library'
        // },
        // {
        //   text: 'Renderizadores Personalizados',
        //   link: '/guide/extras/custom-renderer'
        // },
        // {
        //   text: 'Vue para Desarrolladores de React',
        //   link: '/guide/extras/vue-for-react-devs'
        // }
      ]
    }
  ],
  '/api/': [
    {
      text: 'Globales de la API',
      items: [
        {
          text: 'Aplicación',
          link: '/api/application'
        },
        {
          text: 'General',
          link: '/api/general'
        }
      ]
    },
    {
      text: 'Composition API',
      items: [
        {
          text: 'setup()',
          link: '/api/composition-api-setup'
        },
        {
          text: 'Reactividad: Núcleo (Core)',
          link: '/api/reactivity-core'
        },
        {
          text: 'Reactividad: Utilidades',
          link: '/api/reactivity-utilities'
        },
        {
          text: 'Reactividad: Avanzado',
          link: '/api/reactivity-advanced'
        },
        {
          text: 'Ciclo de Vida de los Hooks',
          link: '/api/composition-api-lifecycle'
        },
        {
          text: 'Inyección de Dependencia',
          link: '/api/composition-api-dependency-injection'
        }
      ]
    },
    {
      text: 'Options API',
      items: [
        {
          text: 'Opciones: Estado',
          link: '/api/options-state'
        },
        {
          text: 'Opciones: Renderizado',
          link: '/api/options-rendering'
        },
        {
          text: 'Opciones: Ciclo de Vida',
          link: '/api/options-lifecycle'
        },
        {
          text: 'Opciones: Composición',
          link: '/api/options-composition'
        },
        {
          text: 'Opciones: Misceláneas',
          link: '/api/options-misc'
        },
        {
          text: 'Instancia de Componente',
          link: '/api/component-instance'
        }
      ]
    },
    {
      text: 'Integrados',
      items: [
        {
          text: 'Directivas',
          link: '/api/built-in-directives'
        },
        {
          text: 'Componentes',
          link: '/api/built-in-components'
        },
        {
          text: 'Elementos Especiales',
          link: '/api/built-in-special-elements'
        },
        {
          text: 'Atributos Especiales',
          link: '/api/built-in-special-attributes'
        }
      ]
    },
    {
      text: 'Componente de un Solo Archivo (Single File Component)',
      items: [
        {
          text: 'Especificaciones de Sintaxis',
          link: '/api/sfc-spec'
        },
        {
          text: '<script setup>',
          link: '/api/sfc-script-setup'
        },
        {
          text: 'Características de CSS',
          link: '/api/sfc-css-features'
        }
      ]
    },
    {
      text: 'APIs Avanzado',
      items: [
        {
          text: 'Función de Renderizado',
          link: '/api/render-function'
        },
        {
          text: 'Renderizado del Lado del Servidor',
          link: '/api/ssr'
        },
        {
          text: 'Tipos de Utilidades de TypeScript',
          link: '/api/utility-types'
        },
        {
          text: 'Renderizador Personalizado',
          link: '/api/custom-renderer'
        }
      ]
    }
  ],
  '/examples/': [
    {
      text: 'Básicos',
      items: [
        {
          text: 'Hola Mundo',
          link: '/examples/#hello-world'
        },
        {
          text: 'Manejando las Entradas del Usuario',
          link: '/examples/#handling-input'
        },
        {
          text: 'Enlaces de Atributos',
          link: '/examples/#attribute-bindings'
        },
        {
          text: 'Condicionales y Bucles',
          link: '/examples/#conditionals-and-loops'
        },
        {
          text: 'Enlaces de Formularios',
          link: '/examples/#form-bindings'
        },
        {
          text: 'Componente Simple',
          link: '/examples/#simple-component'
        }
      ]
    },
    {
      text: 'Práctica',
      items: [
        {
          text: 'Editor de Marcado de Texto',
          link: '/examples/#markdown'
        },
        {
          text: 'Recuperación de Datos',
          link: '/examples/#fetching-data'
        },
        {
          text: 'Cuadrícula con Ordenado y Filtrado',
          link: '/examples/#grid'
        },
        {
          text: 'Vista de Árbol',
          link: '/examples/#tree'
        },
        {
          text: 'Gráficos SVG',
          link: '/examples/#svg'
        },
        {
          text: 'Modal con Transiciones',
          link: '/examples/#modal'
        },
        {
          text: 'Lista con Transiciones',
          link: '/examples/#list-transition'
        },
        {
          text: 'TodoMVC',
          link: '/examples/#todomvc'
        }
      ]
    },
    {
      // https://eugenkiss.github.io/7guis/
      text: '7 GUIs',
      items: [
        {
          text: 'Contador',
          link: '/examples/#counter'
        },
        {
          text: 'Convertidor de Temperatura',
          link: '/examples/#temperature-converter'
        },
        {
          text: 'Reservador de Vuelos',
          link: '/examples/#flight-booker'
        },
        {
          text: 'Temporizador',
          link: '/examples/#timer'
        },
        {
          text: 'CRUD',
          link: '/examples/#crud'
        },
        {
          text: 'Cajón Circular',
          link: '/examples/#circle-drawer'
        },
        {
          text: 'Células',
          link: '/examples/#cells'
        }
      ]
    }
  ],
  '/style-guide/': [
    {
      text: 'Guía de Estilo',
      items: [
        {
          text: 'Descripción General',
          link: '/style-guide/'
        },
        {
          text: 'A - Esenciales',
          link: '/style-guide/rules-essential'
        },
        {
          text: 'B - Fuertemente Recomendado',
          link: '/style-guide/rules-strongly-recommended'
        },
        {
          text: 'C - Recomendado',
          link: '/style-guide/rules-recommended'
        },
        {
          text: 'D - Usar con Precaución',
          link: '/style-guide/rules-use-with-caution'
        }
      ]
    }
  ]
}

export default defineConfigWithTheme<ThemeConfig>({
  extends: baseConfig,

  lang: 'es-ES',
  title: 'Vue.js',
  description: 'Vue.js - El Framework Progresivo de JavaScript',
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],
  scrollOffset: 'header',

  head: [
    [
      'meta',
      {
        name: 'twitter:site',
        content: '@vuejs'
      }
    ],
    [
      'meta',
      {
        name: 'twitter:card',
        content: 'summary'
      }
    ],
    [
      'meta',
      {
        name: 'twitter:image',
        content: 'https://vuejs.org/images/logo.png'
      }
    ],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://sponsors.vuejs.org'
      }
    ],
    [
      'script',
      {},
      fs.readFileSync(
        path.resolve(__dirname, './inlined-scripts/restorePreference.js'),
        'utf-8'
      )
    ],
    [
      'script',
      {
        src: 'https://cdn.usefathom.com/script.js',
        'data-site': 'XNOLWPLB',
        'data-spa': 'auto',
        defer: ''
      }
    ]
  ],

  themeConfig: {
    nav,
    sidebar,

    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: 'f49cbd92a74532cc55cfbffa5e5a7d01',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    carbonAds: {
      code: 'CEBDT27Y',
      placement: 'vuejsorg'
    },

    socialLinks: [
      { icon: 'languages', link: '/translations/' },
      { icon: 'github', link: 'https://github.com/vuejs/' },
      { icon: 'twitter', link: 'https://twitter.com/vuejs' },
      { icon: 'discord', link: 'https://discord.com/invite/HBherRA' }
    ],

    editLink: {
      repo: 'vuejs/docs',
      text: 'Editar esta página en GitHub'
    },

    footer: {
      license: {
        text: 'Licencia MIT',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: `Copyright © 2014-${new Date().getFullYear()} Evan You`
    }
  },

  markdown: {
    config(md) {
      md.use(headerPlugin)
    }
  },

  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    optimizeDeps: {
      include: ['gsap', 'dynamics.js'],
      exclude: ['@vue/repl']
    },
    // @ts-ignore
    ssr: {
      external: ['@vue/repl']
    },
    server: {
      host: true,
      fs: {
        // for when developing with locally linked theme
        allow: ['../..']
      }
    },
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: Infinity
    },
    json: {
      stringify: true
    }
  },

  vue: {
    reactivityTransform: true
  }
})
