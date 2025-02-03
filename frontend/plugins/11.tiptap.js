import {
  VuetifyTiptap,
  VuetifyViewer,
  createVuetifyProTipTap,
  locale,
  BaseKit,
  History,
  Bold,
  Italic,
  Heading,
  TextAlign,
  BulletList,
  OrderedList,
  Link,
  Blockquote,
  HorizontalRule,
  Clear,
} from 'vuetify-pro-tiptap'
import { defineNuxtPlugin } from '#app'
import 'vuetify-pro-tiptap/styles/editor.css'
import '~/assets/scss/tiptap-github-markdown.scss'

export default defineNuxtPlugin(({ vueApp }) => {
  locale.setMessage('pt-BR', {
    'editor.remove': 'Remover',
    'editor.words': 'PALAVRAS',
    'editor.characters': 'CARACTERES',
    'editor.default': 'padrão',
    'editor.size.small.tooltip': 'Pequeno',
    'editor.size.medium.tooltip': 'Médio',
    'editor.size.large.tooltip': 'Cover',
    'editor.bold.tooltip': 'Negrito',
    'editor.italic.tooltip': 'Itálico',
    'editor.underline.tooltip': 'Sublinhado',
    'editor.strike.tooltip': 'Tachado',
    'editor.color.tooltip': 'Cor',
    'editor.highlight.tooltip': 'Destaque',
    'editor.heading.tooltip': 'Títulos',
    'editor.heading.h1.tooltip': 'Título 1',
    'editor.heading.h2.tooltip': 'Título 2',
    'editor.heading.h3.tooltip': 'Título 3',
    'editor.heading.h4.tooltip': 'Título 4',
    'editor.heading.h5.tooltip': 'Título 5',
    'editor.heading.h6.tooltip': 'Título 6',
    'editor.paragraph.tooltip': 'Parágrafo',
    'editor.textalign.tooltip': 'Alinhamento',
    'editor.textalign.left.tooltip': 'Esquerda',
    'editor.textalign.center.tooltip': 'Centro',
    'editor.textalign.right.tooltip': 'Direita',
    'editor.textalign.justify.tooltip': 'Justificado',
    'editor.fontFamily.tooltip': 'Fonte',
    'editor.fontSize.tooltip': 'Tamanho da Fonte',
    'editor.superscript.tooltip': 'Superescrito',
    'editor.subscript.tooltip': 'Subescrito',
    'editor.bulletlist.tooltip': 'Lista Não-ordenada',
    'editor.orderedlist.tooltip': 'Lista Ordenada',
    'editor.tasklist.tooltip': 'Lista de Tarefas',
    'editor.indent.tooltip': 'Aumentar Identação',
    'editor.outdent.tooltip': 'Diminuir Identação',
    'editor.link.tooltip': 'Link',
    'editor.link.dialog.title': 'Inserir link',
    'editor.link.dialog.link': 'link',
    'editor.link.dialog.button.apply': 'aplicar',
    'editor.markdownTheme.tooltip': 'Tema',
    'editor.image.tooltip': 'Imagem',
    'editor.image.float.left.tooltip': 'Flutuar à esquerda',
    'editor.image.float.none.tooltip': 'Sem flutuar',
    'editor.image.float.right.tooltip': 'Flutuar à direita',
    'editor.image.dialog.title': 'Inserir imagem',
    'editor.image.dialog.tab.url': 'url',
    'editor.image.dialog.tab.upload': 'upload',
    'editor.image.dialog.form.link': 'Link',
    'editor.image.dialog.form.alt': 'Alt',
    'editor.image.dialog.form.aspectRatio': 'Travar razão do aspecto original',
    'editor.image.dialog.form.file': 'Arquivo',
    'editor.image.dialog.button.apply': 'aplicar',
    'editor.video.tooltip': 'Vídeo',
    'editor.video.dialog.title': 'Inserir vídeo',
    'editor.video.dialog.link': 'link',
    'editor.video.dialog.button.apply': 'aplicar',
    'editor.table.tooltip': 'Tabela',
    'editor.table.menu.insert_table': 'Inserir Tabela',
    'editor.table.menu.insert_table.with_header_row': 'Com linha de cabeçalho',
    'editor.table.menu.add_column_before': 'Adicionar coluna anterior',
    'editor.table.menu.add_column_after': 'Adicionar coluna posterior',
    'editor.table.menu.delete_column': 'Remover Coluna',
    'editor.table.menu.add_row_before': 'Adicionar Linha Anterior',
    'editor.table.menu.add_row_after': 'Adicionar Linha Posterior',
    'editor.table.menu.delete_row': 'Remover Linha',
    'editor.table.menu.merge_or_split_cells': 'Mesclar ou Separar Células',
    'editor.table.menu.delete_table': 'Remover Tabela',
    'editor.blockquote.tooltip': 'Citação',
    'editor.horizontalrule.tooltip': 'Linha Horizontal',
    'editor.code.tooltip': 'Código',
    'editor.codeblock.tooltip': 'Bloco de Còdigo',
    'editor.clear.tooltip': 'Limpar Formatação',
    'editor.undo.tooltip': 'Desfazer',
    'editor.redo.tooltip': 'Refazer',
    'editor.fullscreen.tooltip.fullscreen': 'Tela Cheia',
    'editor.fullscreen.tooltip.exit': 'Sair da Tela Cheia',
  })

  const vuetifyProTipTap = createVuetifyProTipTap({
    lang: 'pt-BR',
    components: {
      VuetifyTiptap,
      VuetifyViewer,
    },
    markdownTheme: 'github',
    extensions: [
      BaseKit.configure({
        placeholder: {
          placeholder: '',
        },
        bubble: false,
      }),
      History.configure({ divider: true }),
      Bold,
      Italic.configure({ divider: true }),
      TextAlign.configure({ divider: true }),
      Heading.configure({ levels: [3, 4, 5, 6] }),
      Blockquote,
      HorizontalRule.configure({ divider: true }),
      BulletList,
      OrderedList.configure({ divider: true }),
      Link.configure({ divider: true }),
      Clear,
    ],
  })

  vueApp.use(vuetifyProTipTap)
})
