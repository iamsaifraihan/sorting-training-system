import axios from "axios";

export default {
  methods: {
    reqPotatostan() {
      return axios.get(
        "https://my.api.mockaroo.com/potatostan.json?key=eab8c8e0"
      );
    },
  },
};
