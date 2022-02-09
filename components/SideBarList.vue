<template>
  <v-list nav>
    <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
      <v-list-item-icon>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content v-show="showTitle">
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script>
export default {
  props: {
    showTitle: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  data() {
    return {
      items: [
        {
          title: 'الرئيسية',
          icon: 'mdi-home',
          to: '/',
        },

        {
          title: 'الاوامر الادارية',
          icon: 'mdi-sitemap',
          to: '/orders',
        },

        {
          title: 'الطلاب',
          icon: 'mdi-account-group',
          to: '/students',
        },

        {
          title: 'التقارير',
          icon: 'mdi-file-chart',
          to: '/reports',
        },

        {
          title: 'المستخدمين',
          icon: 'mdi-account-supervisor-circle',
          to: '/users',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
</style>