<template>
  <v-container>
    <v-row class="mt-3">
      <v-col cols="12" sm="6">
        <h6 class="text-h6 mb-2">Sorting Training system</h6>
      </v-col>
      <v-col cols="12" sm="6" class="text-right">
        <stopwatch
          v-if="Potatostanlist.length"
          :running="running"
          :resetWhenStart="true"
          ref="timer"
        />
        <v-btn
          v-if="!Potatostanlist.length"
          color="primary"
          @click="dialog = true"
        >
          Start Sorting
        </v-btn>
      </v-col>
    </v-row>
    <v-card elevation="2" class="mt-4 mb-5">
      <v-row class="justify-center">
        <v-col cols="12" class="text-right pb-0" v-if="Potatostanlist.length">
          <span class="text-subtitle-2 mr-3">
            {{ Potatostanlist.length }} people in the List
          </span>
          <v-divider class="mt-4"></v-divider>
        </v-col>
        <v-col cols="12">
          <!-- USER TABLE -->
          <template>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Email</th>
                    <th class="text-left">Potatoes</th>
                    <th class="text-left">Tags</th>
                    <th class="text-left">Full Name</th>
                    <th class="text-left">Location</th>
                  </tr>
                </thead>
                <draggable
                  v-model="Potatostanlist"
                  tag="tbody"
                  @start="drag = true"
                  @end="drag = false"
                  @change="handleSorting"
                >
                  <tr v-for="(item, i) in Potatostanlist" :key="i">
                    <td>
                      <v-checkbox v-model="checkbox" :value="i">
                        <template v-slot:label>
                          <div>{{ item.email }}</div>
                        </template>
                      </v-checkbox>
                    </td>
                    <td>{{ item.potatoes }}</td>
                    <td>
                      <v-chip>{{ item.tag }}</v-chip>
                    </td>
                    <td>
                      {{ item.full_name }}
                    </td>
                    <td>
                      {{ item.location }}
                    </td>
                  </tr>
                </draggable>
              </template>
            </v-simple-table>
          </template>
        </v-col>
        <!-- DEFAULT ALERT MESSAGE -->
        <v-col cols="12" sm="8" md="6" v-if="!Potatostanlist.length">
          <v-alert class="mt-3" dense type="info" outlined>
            Click <strong>Start Sorting</strong> to generate list of people
          </v-alert>
        </v-col>
      </v-row>
    </v-card>
    <!-- DIALOGS -->
    <template>
      <div class="text-center">
        <v-dialog v-model="dialog" width="500">
          <v-card>
            <v-card-title class="text-h5"> How many people? </v-card-title>

            <v-card-text>
              <p>
                Enter a number of how many people you want to add to the list.
              </p>
              <v-text-field
                v-model="numberOfPeople"
                outlined
                min="20"
                max="100"
                type="number"
                dense
                hint="Add number between 20 and 100"
                persistent-hint
                maxlength="3"
                step="any"
                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
              ></v-text-field>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="" @click="dialog = false"> cancel </v-btn>
              <v-btn
                color="primary"
                @click="getPotatostan"
                :loading="loading"
                :disabled="numberOfPeople < 20 || numberOfPeople > 100"
              >
                Start
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </template>
    <!-- SNACKBAR -->
    <v-snackbar
      color="success"
      v-model="snackbar"
      top
      right
      vertical
      timeout="-1"
    >
      Sorting successfully complete.<br />
      Total time:
      <stopwatch :running="running" :resetWhenStart="true" />
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from "../mixins/api.potatostan";
import draggable from "vuedraggable";
import stopwatch from "../components/StopWatch";
export default {
  components: {
    draggable,
    stopwatch,
  },
  mixins: [api],
  name: "HomeView",
  data() {
    return {
      loading: false,
      dialog: false,
      snackbar: false,
      running: false,
      numberOfPeople: 20,
      Potatostanlist: [],
      sortedPotatostanlist: [],
      checkbox: [],
    };
  },
  methods: {
    stopTimer: function () {
      this.running = false;
    },
    startTimer: function () {
      this.running = true;
    },
    getPotatostan() {
      this.loading = true;
      this.reqPotatostan()
        .then((res) => {
          this.dialog = false;
          this.Potatostanlist = res.data.splice(0, this.numberOfPeople);
          this.dialog = false;
          this.startTimer();
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    checkIfSorted(list) {
      let second_index;
      for (let first_index = 0; first_index < list.length; first_index++) {
        second_index = first_index + 1;
        if (list[second_index] - list[first_index] > 0) return false;
      }
      return true;
    },
    handleSorting() {
      this.sortedPotatostanlist = this.Potatostanlist.map((item) => {
        return item.potatoes;
      });
      if (this.checkIfSorted(this.sortedPotatostanlist)) {
        this.stopTimer();
        this.snackbar = true;
        this.Potatostanlist = [];
        this.sortedPotatostanlist = [];
      }
    },
  },
};
</script>
<style scoped>
.theme--light.v-btn.v-btn--has-bg {
  background-color: #eeeeee;
}
.v-card__actions > .v-btn.v-btn {
  padding: 0px 15px;
}
.border {
  border-bottom: solid 1px #ccc;
  margin: 0px -12px;
}
</style>
