<template>
  <el-dialog
    :model-value="dialogVisible"
    :title="title"
    @close="handleCancel"
    destroy-on-close
  >
    <el-form label-width="120" :rules="rules" :model="ruleForm" ref="formRef">
      <el-row>
        <el-col :span="12">
          <el-form-item label="站点名称:" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请输入站点名称" />
          </el-form-item>
          <el-form-item label="站点id:" prop="station_id">
            <el-input
              v-model="ruleForm.station_id"
              placeholder="请输入站点id"
              :disabled="disabled"
            />
          </el-form-item>
          <el-form-item label="所属城市：" prop="city">
            <el-input v-model="ruleForm.city" placeholder="请输入所属城市" />
          </el-form-item>
          <el-form-item label="站点负责人：" prop="person">
            <el-input
              v-model="ruleForm.person"
              placeholder="请输入站点负责人"
            />
          </el-form-item>
          <el-form-item label="负责人电话：" prop="tel">
            <el-input
              v-model="ruleForm.tel"
              placeholder="请输入负责人电话"
              @input="ruleForm.tel = ruleForm.tel.replace(/\D/g, '')"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="快充数：" prop="fast">
            <el-input
              v-model="ruleForm.fast"
              @input="ruleForm.fast = ruleForm.fast.replace(/\D/g, '')"
              placeholder="请输入快充数"
            />
          </el-form-item>
          <el-form-item label="慢充数：" prop="slow">
            <el-input
              v-model="ruleForm.slow"
              @input="ruleForm.slow = ruleForm.slow.replace(/\D/g, '')"
              placeholder="请输入慢充数"
            />
          </el-form-item>
          <el-form-item label="充电站状态：" prop="status">
            <el-select
              placeholder="请选择充电站状态"
              v-model="ruleForm.status"
              :disabled="disabled"
            >
              <el-option
                :label="item.label"
                :value="item.value"
                v-for="item in state"
                :key="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="正在充电：" prop="now">
            <el-input
              v-model="ruleForm.now"
              :disabled="disabled"
              @input="ruleForm.now = ruleForm.now.replace(/\D/g, '')"
              placeholder="请输入正在充电"
            />
          </el-form-item>
          <el-form-item label="故障数：" prop="fault">
            <el-input
              v-model="ruleForm.fault"
              :disabled="disabled"
              @input="ruleForm.fault = ruleForm.fault.replace(/\D/g, '')"
              placeholder="请输入故障数"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { FormRules, FormInstance } from "element-plus";
import { editApi, addApi } from "@/api/modules/monitor";
import { ElMessage } from "element-plus";
import type { RuleForm } from "@/types/monitor.ts";

const props = defineProps<{
  dialogVisible: boolean;
  title: string;
  ruleForm: RuleForm;
}>();
interface StatusOption {
  label: string;
  value: number;
}
const state = reactive<StatusOption[]>([
  {
    label: "使用中",
    value: 2,
  },
  {
    label: "空闲中",
    value: 3,
  },
  {
    label: "维护中",
    value: 4,
  },
  {
    label: "待维修",
    value: 5,
  },
]);
const emit = defineEmits(["close", "reload"]);

const rules = reactive<FormRules>({
  name: [{ required: true, message: "站点名称不能为空", trigger: "blur" }],
  station_id: [{ required: true, message: "站点id不能为空", trigger: "blur" }],
  city: [{ required: true, message: "所属城市不能为空", trigger: "blur" }],
  person: [{ required: true, message: "站点负责人不能为空", trigger: "blur" }],
  tel: [
    { required: true, message: "负责人电话不能为空", trigger: "blur" },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: "请输入正确的手机号",
      trigger: "blur",
    },
  ],
  fast: [{ required: true, message: "快充数不能为空", trigger: "blur" }],
  slow: [{ required: true, message: "慢充数不能为空", trigger: "blur" }],
  status: [{ required: true, message: "充电站状态不能为空", trigger: "blur" }],
  now: [{ required: true, message: "正在充电数不能为空", trigger: "blur" }],
  fault: [{ required: true, message: "故障数量不能为空", trigger: "blur" }],
});

const disabled = computed(() => {
  return props.title === "编辑充电站";
});
const handleCancel = () => {
  formRef.value?.resetFields();
  emit("close");
};
const formRef = ref<FormInstance>();
const handleConfirm = () => {
  formRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      if (props.title === "新增充电站") {
        const res = await addApi(props.ruleForm);
        if (res.code == 200) {
          ElMessage({
            message: res.message,
            type: "success",
          });
          handleCancel();
          emit("reload");
        }
      } else {
        const res = await editApi(props.ruleForm);
        if (res.code == 200) {
          ElMessage({
            message: res.message,
            type: "success",
          });
          handleCancel();
          emit("reload");
        }
      }
    }
  });
};
</script>
