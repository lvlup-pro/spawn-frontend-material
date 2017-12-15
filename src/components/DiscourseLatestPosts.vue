<template>
  <div class="mb-5">
    <v-card v-if="topicsLoaded">

      <v-list two-line subheader class="hidden-sm-and-down">
        <v-subheader inset>
          <a :href="postUrl" target="_blank">{{postUrl}}</a>
        </v-subheader>
        <v-list-item v-for="item in topics" :key="item.title">
          <v-list-tile avatar @click.native="newTab(item.url)">

            <v-list-tile-avatar>
              <img v-bind:src="item.latestPosterAvatarUrl"/>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-chip v-if="item.subCategoryName" small label
                        class="hidden-sm-and-down categoryChip subCategoryChip"
                        :style="subCategoryStyle(item,true)">
                  {{ item.subCategoryName }}
                </v-chip>
                <v-chip v-if="item.categoryName" small label class="categoryChip"
                        :style="categoryStyle(item)">
                  {{ item.categoryName }}
                </v-chip>
              </v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon class="grey--text text--lighten-1">insert_comment</v-icon>
              </v-btn>
            </v-list-tile-action>

            <!-- a lot of code but it prevents from bugging -->
            <v-list-tile-action v-if="item.postsCount <= 15">
              <v-list-tile-action-text>
                {{ item.postsCount }}
              </v-list-tile-action-text>
            </v-list-tile-action>
            <v-list-tile-action v-if="item.postsCount > 15 && item.postsCount < 100">
              <v-list-tile-action-text class="orange--text">
                {{ item.postsCount }}
              </v-list-tile-action-text>
            </v-list-tile-action>
            <v-list-tile-action v-if="item.postsCount > 100">
              <v-list-tile-action-text class="red--text">
                {{ item.postsCount }}
              </v-list-tile-action-text>
            </v-list-tile-action>

            <v-list-tile-action>
              <v-btn icon ripple>
                <v-icon class="grey--text text--lighten-1">schedule</v-icon>
              </v-btn>
            </v-list-tile-action>

            <v-list-tile-action class="pr-2">
              <v-list-tile-action-text>{{ item.updatedAt | prettyDateFrom }}</v-list-tile-action-text>
            </v-list-tile-action>

          </v-list-tile>
        </v-list-item>
      </v-list>

      <!--
      v-list-tile-action can't be hidden by
      'hidden-xs-only' class in Vuetify 0.11.1
      so there is a new block for this case
      -->
      <v-list two-line subheader class="hidden-md-and-up">
        <v-subheader inset>
          <a :href="postUrl" target="_blank">{{postUrl}}</a>
        </v-subheader>
        <v-list-item v-for="item in topics" :key="item.title">
          <v-list-tile avatar @click.native="newTab(item.url)">
            <v-list-tile-avatar>
              <img v-bind:src="item.latestPosterAvatarUrl"/>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
              <v-list-tile-sub-title>
                <v-chip v-if="item.subCategoryName" small label
                        class="hidden-sm-and-down categoryChip subCategoryChip"
                        :style="subCategoryStyle(item,true)">
                  {{ item.subCategoryName }}
                </v-chip>
                <v-chip v-if="item.categoryName" small label class="categoryChip"
                        :style="categoryStyle(item)">
                  {{ item.categoryName }}
                </v-chip>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-item>
      </v-list>

    </v-card>
  </div>
</template>
<script>
  import axios from "axios"

  export default {
    name: 'discourse-latest-posts',
    data() {
      return {
        topicsLoaded: false,
        topics: []
      }
    },
    props: {
      url: {
        type: String,
        default: "https://forum.lvlup.pro/"
      },
      avatarUrl: {
        type: String,
        default: "https://forum.lvlup.pro/"
      },
      postUrl: {
        type: String,
        default: "https://forum.lvlup.pro/"
      }
    },
    mounted() {
      this.site()
    },
    methods: {
      newTab(url) {
        window.open(url, '_blank');
      },
      categoryStyle(item) {
        return {
          "color": "#" + item.categoryTextColor,
          "background-color": "#" + item.categoryColor,
        }
      },
      subCategoryStyle(item) {
        return {
          "color": "#" + item.subCategoryTextColor,
          "background-color": "#" + item.subCategoryColor,
        }
      },
      site() {
        axios.get(this.url + 'site.json')
          .then((res) => {
            this.threads(res.data.categories)
          })
        //FIXME catch network error
        //.catch(function (err) {
        //})
      },
      threads(categories) {
        axios.get(this.url + 'categories_and_latest.json')
          .then((res) => {
            this.topicsLoaded = true
            res.data.topic_list.topics.forEach((t) => {

              let title = t.title
              let latestPosterId
              let latestPosterAvatarUrl
              let postsCount = t.posts_count
              let url = this.postUrl + "t/" + t.id
              // http://stackoverflow.com/a/28683720/1351857
              let updatedAt = parseInt((new Date(t.last_posted_at).getTime() / 1000).toFixed(0))
              let categoryId = t.category_id
              let categoryName,
                categoryColor,
                categoryTextColor,
                subCategoryId,
                subCategoryName,
                subCategoryColor,
                subCategoryTextColor
              //FIXME names are wrong, subcategory is parent, category is child

              //get latest poster
              t.posters.forEach((poster) => {
                if (poster.extras === "latest" || poster.extras === "latest single") {
                  latestPosterId = poster.user_id
                }
              })

              //get latest poster avatar URL
              res.data.users.forEach((user) => {
                if (user.id === latestPosterId) {
                  latestPosterAvatarUrl = this.avatarUrl + user.avatar_template.replace("{size}", 42)
                }
              })

              categories.forEach((category) => {
                if (category.id === categoryId) {
                  categoryName = category.name
                  categoryColor = category.color
                  categoryTextColor = category.text_color
                  if (category.parent_category_id) subCategoryId = category.parent_category_id
                }
              })

              //FIXME don't loop over categories twice...
              if (subCategoryId) {
                categories.forEach((category) => {
                  if (category.id === subCategoryId) {
                    subCategoryName = category.name
                    subCategoryColor = category.color
                    subCategoryTextColor = category.text_color
                  }
                })
              }

              this.topics.push({
                "title": title,
                "latestPosterId": latestPosterId,
                "latestPosterAvatarUrl": latestPosterAvatarUrl,
                "postsCount": postsCount,
                "url": url,
                "updatedAt": updatedAt,
                "categoryName": categoryName,
                "categoryColor": categoryColor,
                "categoryTextColor": categoryTextColor,
                "subCategoryName": subCategoryName,
                "subCategoryColor": subCategoryColor,
                "subCategoryTextColor": subCategoryTextColor,
              })
            })
            //FIXME catch network error
          })
        //.catch(function (err) {
        //})
      }
    }
  }
</script>
<style>
  .categoryChip {
    height: 24px;
    padding: 0 0px;
    margin-left: 0px;
  }

  .subCategoryChip {
    margin-right: 0px;
  }
</style>
