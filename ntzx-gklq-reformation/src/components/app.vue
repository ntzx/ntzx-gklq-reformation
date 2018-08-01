<template>
  <div id="app">
    <ntzx-logo/>
    <serach @gklq-serach="serach" />
    <dtable v-if='result.show'
            :result="result" />
  </div>
</template>

<script>
import ntzxlogo from './logo'
import serach from './serach'
import dtable from './dtable'
import gklqapi from '../gklq-api'

export default {
  data () {
    return {
      result: {
        loading: false,
        show: false,
        data: null,
        currentPage: 1,
        pageSize: 50,
        topic: null,
        sortby: null,
        keyword: null
      }
    }
  },
  components: {
    'ntzx-logo': ntzxlogo,
    serach,
    dtable
  },

  methods: {
    serach (topic, keyword) {
      if (keyword === '') {
        this.$message('请输入关键词')
        return
      }

      this.result.loading = true
      this.result.show = true

      gklqapi(topic, keyword).then(data => {
        this.result.data = data
        this.result.data.sort((a, b) => (b.id - a.id))
        this.result.loading = false
      }).catch(err => {
        if (err) {
          this.$message('获取失败')
          console.log(err)
          this.result.show = false
          this.result.loading = false
        }
      })
    }
  }
}
</script>
