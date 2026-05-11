import "vue";
import type { Store } from "vuex";

import type { RootState } from "@/store";

declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $t: (key: string) => string;
    $i18n: {
      locale: string;
    };
    $store: Store<RootState>;
  }
}
