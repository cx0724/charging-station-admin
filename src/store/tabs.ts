import { defineStore } from "pinia";
interface Tab {
  icon: string
  url: string
  name: string
}
export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabsList: [] as Tab[],
        active: {
            icon: '',
            url: '',
        } as Tab
    }),
    getters: {
        
    },
    actions: {
        addTabs(icon:string,url:string,name:string) {
            if (!this.tabsList.some(item => item.name == name)) {
                this.tabsList.push({icon,url,name})
            }
        },
        activeTab( name: string,url:string) {
            this.active.name = name
            this.active.url = url
        },
        delTabs(tab:string) {
            if (this.active.name === tab) {
                const currentIndex = this.tabsList.findIndex(item => item.name === tab)
                // 判断删除的是否是当前选中的
                if (currentIndex != 0) {
                    this.active.name= this.tabsList[currentIndex-1].name
                    this.active.url= this.tabsList[currentIndex-1].url
                } else {
                    // 判断当前删除的是否是最后一个
                    if (this.tabsList.length>1) {
                        this.active.name= this.tabsList[currentIndex+1].name
                        this.active.url= this.tabsList[currentIndex+1].url
                    } else {
                        return
                    }
                }
            }
            this.tabsList = this.tabsList.filter(item => item.name !== tab)
            
        }
    }
})