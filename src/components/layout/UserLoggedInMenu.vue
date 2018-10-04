<template>
<v-menu offset-y>
    <!-- <v-btn slot="activator">A Menu</v-btn> -->
    <v-btn slot="activator" icon>
        <v-icon>person_outline</v-icon>
    </v-btn>
    <v-list>
        <v-list-tile>
        <v-list-tile-title>Hello, {{user.name}}!</v-list-tile-title>
        </v-list-tile>
        <v-divider></v-divider>
        <v-list-tile @click="logOut">
        <v-list-tile-action><v-icon>exit_to_app</v-icon></v-list-tile-action>
        <v-list-tile-content>Log out</span></v-list-tile-content>
        </v-list-tile>
    </v-list>
</v-menu>
</template>
<script>
import { mapGetters } from "vuex"

export default {
    methods: {
        logOut() {
            this.$emit('userLoggedOut');
        }
    },
    computed: {
      ...mapGetters({user: 'user'})
    }
}
</script>

