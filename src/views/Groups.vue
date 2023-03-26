<template>
  <v-card max-width="40rem" class="mx-auto">
    <v-card-title> Groups </v-card-title>

    <v-card-text>
      <GroupPicker class="group_picker" @selection="select_group($event)" />
    </v-card-text>
  </v-card>
</template>

<script>
import AccountMultipleIcon from "vue-material-design-icons/AccountMultiple.vue";
import InformationOutlineIcon from "vue-material-design-icons/InformationOutline.vue";

import GroupPicker from "@moreillon/vue_group_picker";

export default {
  name: "Groups",
  components: {
    AccountMultipleIcon,
    InformationOutlineIcon,
    GroupPicker,
  },
  data() {
    return {};
  },
  mounted() {
    if (this.$route.path == "/") {
      const group_id = localStorage.getItem("group_id");
      if (group_id)
        this.$router.push({ name: "whereabouts", params: { group_id } });
    }
  },
  methods: {
    select_group(group) {
      const group_id = group._id;
      localStorage.setItem("group_id", group_id);
      this.$router.push({ name: "whereabouts", params: { group_id } });
    },
  },
  computed: {
    official_groups() {
      return this.groups.filter((group) => group.official);
    },
    non_official_groups() {
      return this.groups.filter((group) => !group.official);
    },
  },
};
</script>

<style scoped>
.group_picker {
  max-height: 70vh;
  text-align: left;
}
</style>
