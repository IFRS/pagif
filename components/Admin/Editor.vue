<template>
  <ClientOnly>
    <tiptap-vuetify v-model="content" :extensions="extensions"/>

    <template #placeholder>
      Carregando Editor de Texto...
    </template>
  </ClientOnly>
</template>

<script>
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from 'tiptap-vuetify';

export default {
  name: 'AdminEditor',
  components: {
    TiptapVuetify,
  },
  data() {
    return {
      extensions: [
        History,
        Paragraph,
        [
          Heading,
          {
            options: {
              levels: [3, 4, 5],
            }
          },
        ],
        Bold,
        Italic,
        Underline,
        Strike,
        Link,
        Blockquote,
        ListItem,
        BulletList,
        OrderedList,
        HorizontalRule,
        Code,
        HardBreak,
      ],
    }
  },
}
</script>
