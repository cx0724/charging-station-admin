import type { RouteMeta } from "vue-router";

export interface MenuMeta extends RouteMeta {
  title: string;
}

export interface MenuItem {
  name: string;
  url: string;
  icon: string;
  meta: MenuMeta;
  children?: MenuItem[];
}
