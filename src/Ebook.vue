<template>
  <div class="ebook">
    <title-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevPage"></div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextPage"></div>
      </div>
    </div>
    <menu-bar :ifTitleAndMenuShow="ifTitleAndMenuShow"
              :fontSizeList="fontSizeList"
              :defaultFontSize="defaultFontSize"
              @setFontSize="setFontSize"
              :themeList="themeList"
              :defaultTheme="defaultTheme"
              :bookAvailable="bookAvailable"
              @setTheme="setTheme"
              @onProgressChange="onProgressChange"
              :navigation="navigation"
              @jumpTo="jumpTo"
              ref="menuBar"></menu-bar>
  </div>
</template>

<script>
  import TitleBar from '@/components/TitleBar'
  import MenuBar from '@/components/MenuBar'
  import Epub from 'epubjs'

  const DOWNLOAD_URL = '/static/66485.epub'
  global.ePub = Epub
  export default {
    components: {
      TitleBar,
      MenuBar
    },
    data() {
      return {
        ifTitleAndMenuShow: false,
        fontSizeList: [
          {fontSize: 12},
          {fontSize: 14},
          {fontSize: 16},
          {fontSize: 18},
          {fontSize: 20},
          {fontSize: 22},
          {fontSize: 24},
        ],
        defaultFontSize: 16,
        themeList: [
          {
            name: '默认',
            style: {
              body: {
                'color': '#000',
                'background': '#fff'
              }
            }
          },
          {
            name: '护眼',
            style: {
              body: {
                'color': '#000',
                'background': '#ceeaba'
              }
            }
          },
          {
            name: '夜间',
            style: {
              body: {
                'color': '#fff',
                'background': '#000'
              }
            }
          },
          {
            name: 'gold',
            style: {
              body: {
                'color': '#000',
                'background': 'rgb(241,236,226)'
              }
            }
          },
        ],
        defaultTheme: 0,
        bookAvailable:false //图书是否可用状态
      }
    },
    methods: {
      //根据链接跳转到指定位置
      jumpTo(href){
        this.rendition.display(href)
        this.hideTitleAndMenu()
      },
      hideTitleAndMenu(){
        this.ifTitleAndMenuShow = false
        this.$refs.menuBar.hideSetting();
        this.$refs.menuBar.hideContent();
      },
      //progress 进度条数值(01-100)
      onProgressChange(progress){
        const percentage = progress / 100
        const location = percentage > 0 ? this.locations.cfiFromPercentage(percentage): 0
        this.rendition.display(location)
      },
      setTheme(index) {
        this.themes.select(this.themeList[index].name)
        this.defaultTheme = index
      },
      registerTheme() {
        this.themeList.forEach(theme => {
          this.themes.register(theme.name, theme.style)
        })
      },
      setFontSize(fontSize) {
        this.defaultFontSize = fontSize
        if (this.themes) {
          this.themes.fontSize(fontSize + 'px')
        }
      },
      toggleTitleAndMenu() {
        this.ifTitleAndMenuShow = !this.ifTitleAndMenuShow
        if (!this.ifTitleAndMenuShow) {
          this.$refs.menuBar.hideSetting()
        }
      },
      prevPage() {
        //Rendition.prev
        if (this.rendition) {
          this.rendition.prev()
        }
      },
      nextPage() {
        if (this.rendition) {
          this.rendition.next()
        }
      },
      //电子书的解析和渲染
      showEpub() {
        //生成Book对象
        this.book = new Epub(DOWNLOAD_URL)
        //生成Rendition , 通过Book,renderTo
        this.rendition = this.book.renderTo('read', {
          width: window.innerWidth,
          height: window.innerHeight
        })
        //通过Rendtion.display渲染电子书
        this.rendition.display()
        //获取Theme对象
        this.themes = this.rendition.themes
        //设置默认字体
        this.setFontSize(this.defaultFontSize)
        //this.themes.register(name,styles)
        //this.themes.select(name)
        this.registerTheme()
        this.setTheme(this.defaultTheme)

        //获取Locations对象
        //通过epubjs的狗子函数来实现
        this.book.ready.then(() => {
          this.navigation = this.book.navigation
          return this.book.locations.generate()
        }).then(result => {
          this.locations = this.book.locations
          this.bookAvailable = true
        })

      }
    },
    mounted() {
      this.showEpub()
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/global";

  .ebook {
    position: relative;
    .read-wrapper {
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        z-index: 100;
        width: 100%;
        height: 100%;
        .left {
          flex: 0 0 px2rem(100);
        }
        .center {
          flex: 1;
        }
        .right {
          flex: 0 0 px2rem(100);
        }
      }
    }
  }
</style>
