'use strict';

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const store = createPinia();

// https://www.reddit.com/r/vuejs/comments/107dudn/comment/j3pkx1z/
store.use(piniaPluginPersistedstate);

export default store;
