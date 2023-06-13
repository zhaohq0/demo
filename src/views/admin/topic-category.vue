<template  >
  <div>

    <div class="tools">
      <h3>话题分类管理</h3>
    </div>

    <!-- 页面数据 -->
      <div>
        <el-button round @click="showDialog(true)" type="primary">添加话题分类</el-button>
      </div>

    <div>
      <el-table :data="topicComments" style="width: 100%;">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="name" label="分类昵称" width="120" />
        <el-table-column prop="showStatus" label="是否启用" width="100">
          <template #default="scoped">
            <el-switch v-model="scoped.row.showStatus" disabled >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作列表" width="280">
          <template #default="scope">
            <el-button round  @click="showDialog(false, scope.row)">编辑</el-button>
            <el-popconfirm title="删除将无法恢复！确定删除?" @confirm="del(scope.row.id)">
              <template #reference>
                <el-button round   type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div style="margin-top: 10px;margin-left: 30%;">
      <el-pagination :current-page="resultData.current"  :page-size="resultData.size"
                     :disabled="disabled" :background="background" :page-sizes="[3, 5, 7, 10]"
                     layout="total, sizes, prev, pager, next, jumper" :total="resultData.total" @size-change="handleSizeChange"
                     @current-change="handleCurrentChange" />
    </div>


    <el-dialog v-model="dialogFormVisible" :title="wantAdd ? '分类添加' : '分类修改'" :width="500">
      <el-form ref="dialogFormRef" :model="topic" :rules="rules">
        <el-form-item label="名称" prop="name" :label-width="formLabelWidth">
          <el-input maxlength="20" v-model="topic.name" autocomplete="off" clearable />
        </el-form-item>
        <el-form-item label="是否生效" prop="name" :label-width="formLabelWidth">
          <el-switch v-model="topic.showStatus">
          </el-switch>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="resetForm()">重置</el-button>
          <el-button type="primary" @click="save">
            保存
          </el-button>
        </span>
      </template>
    </el-dialog>

  </div>
</template>

<script>

import { defineComponent, ref } from "vue"
import { topicAdd, topicDelId, topicEdit, topicPage, topicCategoryPage } from "../../http/topicCategory";
import { topicUtils } from "../../utils/topicUtils";
import { cloneDeep, random } from 'lodash-es'

export default defineComponent({
  data() {
    return {
      dat: {},//正在操作的数据对象
      topicCategorys: [],//话题类别
      topicComments: [],   //话题
      resultData: {},
      requestData: {
        "current": 1,
        "size": 10
      },
      topic: {
        "name": "",
        "showStatus": 1,
      },
      choseRow: {},//选中的某一行
      dialogFormVisible: false,//编辑框
      formLabelWidth: 100,
      dialogVisible: false,//确定提示框
      wantAdd: true, //添加 或者 修改的 意图
      rules: {
        "name": [
          { required: true, message: '必须填入话题分类!', trigger: 'blur' },
          { max: 10, message: '话题分类长度超过限制? 限制10字!', trigger: 'blur' },
        ],

      }

    }
  },
  mounted() {//渲染完毕就开始调用
    //加载数据
    this.getTopicPage();
    this.getAllTopicCategorys();
  },
  methods: {
    //获取所有的类别数据
    getAllTopicCategorys(size =1 ) {
      const reqdata = {
        "current": 1,
        "size": size,
      }

      topicCategoryPage(reqdata).then(res => {
        // console.log(res);
        if (size > 1) {
          this.topicCategorys = res.data.page.records;
          console.log("--------->", this.topicCategorys);
          return null;
        }
        console.log("-->",res.data.page.records);

        return this.getAllTopicCategorys(res.data.page.total + 1);
      }).catch(err => {
        console.log("获取类数据失败!");
      })
    },

    getTopicPage() {
      topicPage(this.requestData).then(res => {
        this.topicComments = res.data.page.records;
        this.resultData = res.data.page;
        this.topicComments.forEach(i=>{
          i.showStatus = (i.showStatus == 1);
        })
      }).catch(err => {
        console.log(err);
      })
    },

    //改变数据量
    handleSizeChange(val) {
      this.requestData.size = val;
      this.getTopicPage();
    },
    //改变页码
    handleCurrentChange(val) {
      this.requestData.current = val
      this.getTopicPage();
    },
    //显示弹框编辑和添加弹框
    showDialog(wantadd, dat) {
      //保存意图信息
      this.wantAdd = wantadd;
      this.dat = cloneDeep(dat);

      if (!wantadd) {
        this.topic = cloneDeep(dat);
        console.log(dat);
      } else {
        this.topic.name = "";
        this.topic.showStatus=1;
      }
      //显示页面
      this.dialogFormVisible = true;

    },
    // console.log("删除--->", id);
    del(id) {

      const params = {
        id: id
      };
      topicDelId(params).then(res => {
        if (res.success) {
          console.log("--删除成功--");
          this.getTopicPage(id)
          if (id % 2 != 0) { //该处应该判断为奇数页面就删除前进一个也买呢
            this.getTopicPage(this.requestData.current - 1);
          }
          else {
            console.log("--删除成功!--");
            this.getTopicPage(this.requestData.current);
          }
          ElMessage({ message: '数据删除成功!', type: 'success' });
        } else {
          // console.log("删除失败");
          ElMessage({
            message: '删除警告,数据删除失败!',
            type: 'warning',
          })
        }
      }).catch(err => {
        console.log("访问错误", err);
        ElMessage.error('删除错误，代码可能有错！' + err)
      })
    },
    // 添加保存  和  编辑保存
    async save() {
      await this.$refs.dialogFormRef.validate((valid, fields) => {
        if (valid) {
          console.log('submit!')
          //添加
          if (this.wantAdd) {
            topicAdd(this.topic).then(res => {
              ElMessage({ message: '数据添加成功!', type: 'success' });
              // console.log(this.resultData);
              // console.log("---添加成功---",this.resultData.total,this.resultData.size);
              //没有多余?
              this.requestData.current = Math.ceil((this.resultData.total + 1) / this.resultData.size );
              this.getTopicPage();

            }).catch(err => {
              ElMessage.error('添加错误，网络接口出错！')
            })

          } else {
            this.topic.showStatus = this.topic.showStatus?1:0;
            //编辑 保存
            topicEdit(this.topic).then(res => {
              // console.log("----修改成功---");
              ElMessage({ message: '数据修改成功!', type: 'success' });
              this.getTopicPage();

            }).catch(err => {
              // console.log("---修改失败---");
              ElMessage.error('修改错误，网络接口出错！')
            })

          }
          this.dialogFormVisible = false;
        } else {
          console.log('error submit!', fields)
        }
      })

    },
    // 重置表单
    resetForm() {
      console.log(this.$refs.dialogFormRef);
      this.$refs.dialogFormRef.resetFields();
      // console.log("--->>.",this.wantAdd);
      if (!this.wantAdd) {
        this.topic = cloneDeep(this.dat);
      } else {
        this.topic = cloneDeep(this.topic);
      }
    },
    //获取随机类型颜射
    getRandColor() {
      let colortypes = ["primary", "success", "warming", "danger", "info"];
      let clo = Math.floor(Math.random() * colortypes.length);
      return colortypes[clo];
    },
    // 检测checkCategoryId规范
    checkCategoryId(rule, value, callback) {
      if (value === '') {
        callback(new Error('该处为必填框,必须输入值!!!'))
      }
      else if (value in Array.from(this.topicCategorys,({id})=>id  )  ) {
        callback(new Error("请输入正确的类别id"))
      }
      else {
        callback()
      }

    }

  },


})
</script>

<style lang="scss" scoped>
.el-link {
  margin-right: 8px;
}

.el-link .el-icon--right.el-icon {
  vertical-align: text-bottom;
}
</style>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             