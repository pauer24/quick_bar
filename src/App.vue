<template>
  <v-app>
    <main-layout v-if="isInitialized" @logOut="resetApp()"></main-layout>
    <v-content v-else>
      <v-img src="https://wallpapers.wallhaven.cc/wallpapers/full/wallhaven-309808.jpg">
        <v-container fluid grid-list-md>
          <v-layout row>
            <v-flex>
              <h1 class="ma-5">Welcome to Q-BAR!</h1>
            </v-flex>
          </v-layout>
        </v-container>
        <v-form ref="form">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-card class="pa-4 mb-3 semitransparent">
                  <v-text-field :value="user.name" @input="setUserName" label="Username" required></v-text-field>
                  <v-select :items="['waiter', 'cooker']" :value="user.role" @input="setUserRole" label="Role" ></v-select>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-flex xs12 sm6>
                <v-card class="px-4 pb-4 semitransparent" v-if="showConfigSection">
                  <v-card-title primary-title>
                    <h3>Firestore configuration</h3>
                  </v-card-title>
                  <v-text-field v-model="firestoreConfig.apiKey" label="API key" required></v-text-field>
                  <v-text-field v-model="firestoreConfig.authDomain" label="Auth domain" required></v-text-field>
                  <v-text-field v-model="firestoreConfig.projectId" label="Project ID" required></v-text-field>
                </v-card>
              </v-flex>
            </v-layout>
            <v-layout>
              <v-btn @click="isValid" class="transparent">Ready!</v-btn>
            </v-layout>
          </v-container>
        </v-form>
      </v-img>
    </v-content>
  </v-app>
</template>

<script>
import MainLayout from './components/layout/MainLayout.vue';
import { mapActions, mapGetters } from 'vuex';
import firebase from 'firebase/app';
import 'firebase/firestore'

export default {
  data() {
    return {
      firestoreConfig: {},
      showConfigSection: false,
      isInitialized: false,
      firestoreInitialized: false,
    };
  },
  created() {
    this.firestoreConfig = this.getFirestoreConfigFromFile();
    this.showConfigSection = this.firestoreConfig == null && this.isValidFirestoreConfig();
    this.isValid();
  },
  methods: {
    ...mapActions({
      setUserName: 'setUserName',
      setUserRole: 'setUserRole',
      setProducts: 'setProducts',
      setMenu: 'setMenu',
      setOrders: 'setOrders' }),
    getFirestoreConfigFromFile() {
      try {
        return require("../public/firestoreConfig.json");
      } catch (e) {
        return null;
      }
    },
    isValid() {
      if (!!this.user.name && !!this.user.role && this.isValidFirestoreConfig()) {
        this.isInitialized = true;
        this.initializeFirestore();
      }
    },
    initializeFirestore() {
      if (!this.isValidFirestoreConfig()) {
        throw "Firestore configuration is not valid!";
      }

      if(this.firestoreInitialized) {return;}
      firebase.initializeApp(this.firestoreConfig);
      firebase.firestore().settings({ timestampsInSnapshots: true });
      this.firestoreInitialized = true;

      this.updateStoreFromFirestore();
    },
    updateStoreFromFirestore() {
      let component = this;
      let firestore = firebase.firestore();

      let mapSnapshotDocuments = (snap) => {
        return snap.docs.map(doc => {
          let p = doc.data();
          p.id = doc.id;
          return p;
        });
      }

      firestore.collection('products').onSnapshot(function(snap) {
        let updatedProducts = mapSnapshotDocuments(snap);
        component.setProducts(updatedProducts);
      });

      firestore.collection('menu').onSnapshot(function(snap) {
        let updatedMenu = mapSnapshotDocuments(snap);
        component.setMenu(updatedMenu[0]);
      });

      firestore.collection('orders').onSnapshot(function(snap) {
        let updatedOrders = mapSnapshotDocuments(snap);
        component.setOrders(updatedOrders);
      })
    },
    isValidFirestoreConfig() {
      let result =
        !!this.firestoreConfig.apiKey &&
        !!this.firestoreConfig.authDomain &&
        !!this.firestoreConfig.projectId;
      return result;
    },
    resetApp() {
      this.setUserName(null);
      this.isInitialized = false;
    }
  },
  computed: {
    ...mapGetters({user: 'user'}),
  },
  components: {
    mainLayout: MainLayout
  }
};
</script>
<style scoped>
.v-card {
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
