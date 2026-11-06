import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
const config: Config = {
  title: 'Action-Flow IR',
  tagline: 'A typed representation of application logic',
  url: 'https://example.invalid',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  markdown: {format: 'detect', hooks: {onBrokenMarkdownLinks: 'throw'}},
  i18n: {defaultLocale: 'en', locales: ['en']},
  presets: [['classic', {
    docs: {path: '../doc', sidebarPath: './sidebars.ts'},
    blog: false,
    theme: {customCss: './src/css/custom.css'},
  } satisfies Preset.Options]],
  themeConfig: {
    navbar: {title: 'Action-Flow IR', items: [
      {type: 'docSidebar', sidebarId: 'projectSidebar', label: 'Documentation', position: 'left'},
    ]},
    footer: {style: 'dark', copyright: 'Action-Flow IR — development draft'},
  } satisfies Preset.ThemeConfig,
};
export default config;
