import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios';
import DataUtils from './utils/data-utils.js';
import {
  ES_QUERY_LIMIT,
  CC_LIST_ID
} from './consts/constants.js';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    queryObject: {term:'', phrase: false, limit: ES_QUERY_LIMIT},
    lastQueryObject: {term:'', phrase: false, limit: ES_QUERY_LIMIT},
    searching: false,
    sortBy: 'relevance',
    searchError: false,
    searchMessage: '',
    MainData: [],
    registering: false,
    registerError: false,
    registerMessage: '',
    isMobile: false,
    emailRegistrationActive: true,
    version: DataUtils.resolveVersion(JSON.parse(unescape(process.env.VUE_APP_PACKAGE_JSON || '%7Bversion%3A0%7D'))),
    isProcessing: false,
    processingError: false,
    processingMessage: '',
    processingId: null,
    engagementPopup: null
  },
  mutations: {
    setQueryObject(state, val) {
      state.queryObject = val;
    },
    setLastQueryObject(state, val) {
      state.lastQueryObject = val;
    },
    setSearching(state, tufa) {
      state.searching = tufa;
    },
    setMainData(state, data) {
      state.MainData = data;
    },
    setSortBy(state, data){
      state.sortBy = data;
    },
    setIsMobile(state, data) {
      state.isMobile = data;
    },
    setRegistering(state, val) {
      state.registering = val;
    },
    setRegisterError(state, val) {
      state.registerError = val;
    },
    setRegisterMessage(state, val) {
      state.registerMessage = val;
    },
    setSearchError(state, val) {
      state.searchError = val;
    },
    setSearchMessage(state, val) {
      state.searchMessage = val
    },
    setEmailRegistrationActive(state, val) {
      state.emailRegistrationActive = val;
    },
    setIsProcessing(state, val) {
      state.isProcessing = val;
    },
    setProcessingError(state, val) {
      state.processingError = val;
    },
    setProcessingMessage(state, val) {
      state.processingMessage = val;
    },
    setProcessingId(state, val) {
      state.processingId = val;
    },
    setEngagementPopup(state, val) {
      state.engagementPopup = val;
    }
  },
  actions: {
    searchDataAssets({commit}, searchObj) {
      const webApi = axios({
        method: 'POST',
        headers: { "content-type": "application/json" },
        crossDomain: true,
        url: '/api/v1/search',
        data: searchObj
      });

      commit('setSearching', true);
      commit('setMainData', []);
      commit('setSearchError', false);
      commit('setSearchMessage', '');
      commit('setSortBy', 'relevance');
      Promise.all([webApi]).then( result => {
        if (DataUtils.validResponse(result[0])) {
          let data = [...result[0].data.result.result];
          commit('setMainData', data);
        } else {
          let errors = DataUtils.getErrors(result[0]);
          commit('setSearchError', true);
          commit('setSearchMessage', errors);
        }
        commit('setSearching', false);
      }).catch((e) => {
        commit('setSearchError', true);
        commit('setSearchMessage', e);
      })
    },
    registerEmail({commit}, email) {
      let payload = {
        listId: CC_LIST_ID,
        email: email
      };
      const ccApi = axios({
        method: 'POST',
        headers: { "content-type": "application/json" },
        crossDomain: true,
        url: '/apicc/v1/contacts',
        data: payload
      });

      commit('setRegistering', true);
      commit('setRegisterError', false);
      commit('setRegisterMessage', '');
      Promise.all([ccApi]).then( result => {
        if(DataUtils.validCCResponse(result[0])) {
          commit('setRegisterMessage', 'Registration completed.');
        } else {
          let errors = DataUtils.getErrors(result[0]);
          commit('setRegisterError', true);
          commit('setRegisterMessage', errors);
        }

        commit('setRegistering', false)
      }).catch((e) => {
        commit('setRegistering', false);
        commit('setRegisterError', true);
        commit('setRegisterMessage', e);
      });
    },
    getEngagementPopups: function({commit}) {
      commit('setIsProcessing', true);
      commit('setProcessingError', false);
      commit('setProcessingMessage','Processing...');
      commit('setEngagementPopup', null);

      let options =  { headers: {'Content-Type':'application/json'}};

      axios
      .get('/api/v1/configurations/engagementpopups', options)
      .then( response => {
        if (DataUtils.validResponse(response)) {
          commit('setEngagementPopup', response.data.result[0]);
        } else {
          let msg = DataUtils.getErrors(response);
          commit('setProcessingError', true);
          commit('setProcessingMessage', msg)
        }
        commit('setIsProcessing', false);
      })
      .catch( (error) => {
        commit('setProcessingError', true);
        commit('setProcessingMessage',  error.response.statusText);
        commit('setIsProcessing', false);
      })
    }
  }
})
