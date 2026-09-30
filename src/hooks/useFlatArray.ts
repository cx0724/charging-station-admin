// 数组扁平化
import { ref } from "vue";

import { type MenuItem } from "@/types/menu";

export function useFlatArray() {
  const flatArray = ref<any[]>([]);

  const flat = (arr: MenuItem[]) => {
    arr.forEach((item) => {
      // 先把当前元素放进去
      flatArray.value.push(item);

      // 如果有 children，递归处理
      if (item.children?.length) {
        flat(item.children);
      }
    });

    return flatArray.value;
  };

  return {
    flat,
  };
}
