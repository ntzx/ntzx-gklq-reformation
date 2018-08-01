<template>
  <div>
    <el-table :data="dataSlice"
              border
              :default-sort="{prop: 'id',order:'descending'}"
              @sort-change="sortChange"
              v-loading="result.loading">
      <el-table-column v-for="(lab,prop) in columns"
                       :prop="prop"
                       :label="lab"
                       :key='prop'
                       sortable="custom"
                       :sort-orders="['ascending','descending']">
      </el-table-column>
    </el-table>
    <div v-if="result.data!==null">
      <div>
        <el-pagination :current-page.sync="result.currentPage"
                       :page-size="result.pageSize"
                       :pager-count="5"
                       layout="prev, pager, next"
                       :total="result.data.length">
        </el-pagination>
      </div>
      <div>
        <el-pagination layout="total"
                       :total="result.data.length">
        </el-pagination>
        <el-pagination :current-page.sync="result.currentPage"
                       layout="jumper"
                       :total="result.data.length">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columns: {
        id: '序号',
        name: '姓名',
        gender: '性别',
        university: '大学',
        major: '专业',
        elementary: '小学',
        junior: '初中'
      }
    }
  },

  props: ['result'],

  computed: {
    dataSlice () {
      let r = this.result
      if (r.data === null) {
        return []
      }
      let s = (r.currentPage - 1) * r.pageSize
      let e = s + r.pageSize
      return r.data.slice(s, e)
    }
  },
  methods: {
    sortChange ({col, prop, order}) {
      if (this.result.data === null) return
      if (prop !== null) {
        let fn
        if (order === 'ascending') {
          fn = (a, b, aid, bid) => (a === b ? aid - bid : (a < b ? -1 : 1))
        }
        if (order === 'descending') {
          fn = (a, b, aid, bid) => (a === b ? bid - aid : (a < b ? 1 : -1))
        }
        this.result.data.sort((a, b) => (fn(a[prop], b[prop], a.id, b.id)))
        this.result.currentPage = 1
      }
    }
  }
}
</script>

<style scoped>
div {
  text-align: center;
}

.el-table {
  margin: 0 auto;
  margin-top: 2em;
  margin-bottom: 0.25em;
  width: 900px;
  max-width: 100%;
}

.el-pagination {
  color: #909399;
  display: inline-block;
}

.el-table /deep/ .el-loading-spinner {
  top: 2em;
  margin-top: 2em;
}
</style>
