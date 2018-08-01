<template>
  <div>
    <el-input placeholder="请输入关键词"
              v-model="keyword"
              clearable
              class="input-with-select">
      <el-select v-model="topic"
                 slot="prepend">
        <el-option v-for='(label,topic) in topics'
                   :label="label"
                   :value="topic"
                   :key="topic" />
      </el-select>
      <el-button slot="append"
                 icon="el-icon-search"
                 @click="$emit('gklq-serach',topic,keyword)"></el-button>
    </el-input>
  </div>
</template>

<style scoped>
div {
  margin-top: 10px;
  text-align: center;
}

.el-input {
  max-width: 900px;
}

.el-select {
  width: 9.5em;
}

.input-with-select {
  background-color: #fff;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}

.input-with-select /deep/ .el-input-group__append {
  background-color: #fff;
}
</style>

<script>
export default {
  data () {
    return {
      topics: [
        '智能搜索',
        '按序号搜',
        '按姓名搜',
        '按性别搜',
        '按大学搜',
        '按专业搜',
        '按小学搜',
        '按初中搜',
        '按毕业时间搜' ],
      topic: 0,
      keyword: ''
    }
  }
}
</script>
