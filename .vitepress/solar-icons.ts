import type MarkdownIt from 'markdown-it'

const solarIconByEmoji = {
  '✅': 'check',
  '❌': 'cross',
  '⚠️': 'danger',
  '⚠': 'danger',
  '❗': 'danger',
  '🔴': 'danger',
  '🟠': 'danger',
  '🟡': 'danger',
  '🟢': 'check',
  '📋': 'clipboard',
  '💬': 'chat',
  '👤': 'user',
  '💡': 'lightbulb',
  '🔗': 'link',
  '⚡': 'bolt',
  '📌': 'pin',
  '🏆': 'trophy',
  '🛠️': 'settings',
  '🛠': 'settings',
  '🚀': 'rocket',
  '🔍': 'magnifier',
  '📝': 'notes',
  '📎': 'paperclip',
  '📈': 'chart',
  '📉': 'graph-down',
  '📊': 'chart',
  '🎨': 'palette',
  '🗂️': 'layers',
  '🗂': 'layers',
  '📂': 'folder',
  '📄': 'document',
  '🎯': 'target',
  '🤖': 'cpu',
  '🗺️': 'map',
  '🗺': 'map',
  '🌐': 'global',
  '⚙️': 'settings',
  '⚙': 'settings',
  '🧱': 'widget',
  '🧭': 'compass',
  '🧪': 'test',
  '🧩': 'widget',
  '🧠': 'cpu',
  '🤝': 'handshake',
  '🖼️': 'gallery',
  '🖼': 'gallery',
  '📢': 'speaker',
  '💾': 'storage',
  '👉': 'arrow-right',
  '🏢': 'building',
  '🏁': 'flag',
  '🌿': 'leaf',
  '⭐': 'star',
  '⬜': 'unchecked',
  'ℹ️': 'info',
  'ℹ': 'info',
  '↩️': 'undo',
  '↩': 'undo',
  '↔️': 'transfer',
  '↔': 'transfer',
} as const

const emojiPattern = new RegExp(
  Object.keys(solarIconByEmoji)
    .sort((left, right) => right.length - left.length)
    .map(emoji => emoji.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|'),
  'gu',
)

export function solarIconsMarkdownPlugin(md: MarkdownIt) {
  md.core.ruler.after('inline', 'solar-icons', (state) => {
    for (const blockToken of state.tokens) {
      if (blockToken.type !== 'inline' || !blockToken.children) continue

      const nextChildren = []

      for (const token of blockToken.children) {
        if (token.type !== 'text' || !emojiPattern.test(token.content)) {
          emojiPattern.lastIndex = 0
          nextChildren.push(token)
          continue
        }

        emojiPattern.lastIndex = 0
        let textStart = 0

        for (const match of token.content.matchAll(emojiPattern)) {
          const matchStart = match.index

          if (matchStart > textStart) {
            const textToken = new state.Token('text', '', 0)
            textToken.content = token.content.slice(textStart, matchStart)
            nextChildren.push(textToken)
          }

          const iconToken = new state.Token('html_inline', '', 0)
          const iconName = solarIconByEmoji[match[0] as keyof typeof solarIconByEmoji]
          iconToken.content = `<SolarIcon name="${iconName}" />`
          nextChildren.push(iconToken)
          textStart = matchStart + match[0].length
        }

        if (textStart < token.content.length) {
          const textToken = new state.Token('text', '', 0)
          textToken.content = token.content.slice(textStart)
          nextChildren.push(textToken)
        }
      }

      blockToken.children = nextChildren
    }
  })
}
