<template>
  <div>
    <v-navigation-drawer fixed :mini-variant="miniVariant" v-model="drawer" clipped app>
      <v-list>
        <router-link :to="item.to" tag="v-list-tile" active-class="active" value="true" v-for="(item, i) in items" :key="i">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <!-- <v-toolbar fixed app :clipped-left="clipped" > -->
    <v-toolbar fixed app clipped-left>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <!-- <v-btn icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn> -->
      <!-- <v-btn icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn> -->
      <v-toolbar-title>Q-Bar</v-toolbar-title>
      <v-spacer></v-spacer>
      <user-logged-in :username="username" @userLoggedOut="logOut" />
    </v-toolbar>
    <v-content>
      <v-container fluid>
        <v-slide-y-transition mode="out-in">
          <router-view></router-view>
        </v-slide-y-transition>
      </v-container>
    </v-content>
  </div>
</template>

<script>
  import UserLoggedIn from './UserLoggedIn.vue'

  export default {
    props: ['username'],
    data () {
      return {
        clipped: true,
        drawer: true,
        fixed: false,
        items: [
          { icon: 'notifications', title: 'Pending orders', to: '/orders/pending'},
          { icon: 'note_add', title: 'Add order', to: '/order/new'},
          { icon: 'history', title: 'Order historic', to: '/history'},
          { icon: 'settings', title: 'Settings', to: '/settings'}
        ],
        miniVariant: false,
      }
    },
    methods: {
      logOut() {
        this.$emit('logOut')
      }
    },
    components: {
      UserLoggedIn
    }
  }
</script>
