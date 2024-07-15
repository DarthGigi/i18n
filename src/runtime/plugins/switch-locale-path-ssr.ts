import { SWITCH_LOCALE_PATH_LINK_IDENTIFIER } from '#build/i18n.options.mjs'
import { useSwitchLocalePath } from '#i18n'
import { defineNuxtPlugin } from '#imports'

// Replace `SwitchLocalePathLink` href in rendered html for SSR support
export default defineNuxtPlugin({
  name: 'i18n:plugin:switch-locale-path-ssr',
  dependsOn: ['i18n:plugin'],
  setup(nuxt) {
    if (nuxt.$config.public.i18n.experimental.switchLocalePathLinkSSR !== true) return

    const switchLocalePath = useSwitchLocalePath()

    const switchLocalePathLinkWrapperExpr = new RegExp(
      [
        `<!--${SWITCH_LOCALE_PATH_LINK_IDENTIFIER}-\\[(\\w+)\\]-->`,
        `.+?`,
        `<!--/${SWITCH_LOCALE_PATH_LINK_IDENTIFIER}-->`
      ].join(''),
      'g'
    )

    nuxt.hook('app:rendered', ctx => {
      if (ctx.renderResult?.html == null) return

      ctx.renderResult.html = (ctx.renderResult.html as string).replaceAll(
        switchLocalePathLinkWrapperExpr,
        (match: string, p1: string) => match.replace(/href="([^"]+)"/, `href="${switchLocalePath(p1 ?? '')}"`)
      )
    })
  }
})
