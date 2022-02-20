<template>
  <div id="StudentsMainPage">
    <!-- تعميم الامر الاداري -->
    <v-dialog
      v-model="adminOrderDialog"
      persistent
      transition="slide-y-transition"
      max-width="750px"
    >
      <v-card color="primary" class="shadow-1 rounded-1">
        <v-toolbar color="secondary" class="shadow-1 rounded-1">
          <h4 v-if="!isLevelUpApi && !isGraduationApi">تعميم امر اداري</h4>
          <h4 v-if="isLevelUpApi">ترحيل الطلاب</h4>
          <h4 v-if="isGraduationApi">تخريج الطلاب</h4>

          <v-spacer></v-spacer>

          <v-btn
            color="accent"
            icon
            @click="
              adminOrderDialog = false
              isLevelUpApi = false
              isGraduationApi = false
            "
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="pa-10">
          <v-form
            ref="adminOrderForm"
            v-model="adminOrderForm"
            lazy-validation
            @submit.prevent="createAdminOrders"
          >
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="12" lg="12" xl="12">
                <v-select
                  v-model="orderTitle"
                  :items="computedOrderSelectTitle"
                  item-value="idOrderTitle"
                  item-text="title"
                  color="accent"
                  outlined
                  item-color="accent"
                  label="عنوان الامر الاداري"
                  :rules="rules"
                  return-object
                ></v-select>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6" lg="6" xl="6">
                <v-text-field
                  v-model="orderNumber"
                  color="accent"
                  outlined
                  label="رقم الامر الاداري"
                  :rules="rules"
                ></v-text-field>
              </v-col>

              <v-col
                cols="12"
                xs="12"
                sm="12"
                :md="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
                :lg="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
                :xl="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
              >
                <v-select
                  v-model="orderLevel"
                  :items="orderSelectLevel"
                  item-value="value"
                  item-text="text"
                  color="accent"
                  outlined
                  item-color="accent"
                  label="مرحلة الامر الاداري"
                  :rules="rules"
                  return-object
                ></v-select>
              </v-col>

              <v-col
                v-if="isLevelUpApi || isGraduationApi"
                cols="12"
                xs="12"
                sm="12"
                :md="isLevelUpApi ? '6' : '6'"
                :lg="isLevelUpApi ? '6' : '6'"
                :xl="isLevelUpApi ? '6' : '6'"
              >
                <v-select
                  v-model="orderNewLevel"
                  :items="orderSelectLevel"
                  item-value="value"
                  item-text="text"
                  color="accent"
                  outlined
                  item-color="accent"
                  label="مرحلة الطالب"
                  :rules="rules"
                ></v-select>
              </v-col>

              <v-col
                cols="12"
                xs="12"
                sm="12"
                :md="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
                :lg="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
                :xl="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
              >
                <v-select
                  v-model="orderYear"
                  :items="orderSelectYear"
                  item-value="idYearStudy"
                  item-text="year"
                  color="accent"
                  outlined
                  item-color="accent"
                  label="سنة الامر الاداري"
                  :rules="rules"
                  return-object
                ></v-select>
              </v-col>

              <v-col
                v-if="isGraduationApi"
                cols="12"
                xs="12"
                sm="12"
                :md="isGraduationApi ? '6' : '4'"
                :lg="isGraduationApi ? '6' : '4'"
                :xl="isGraduationApi ? '6' : '4'"
              >
                <v-select
                  v-model="graduationDate"
                  :items="orderSelectYear"
                  item-value="idYearStudy"
                  item-text="year"
                  color="accent"
                  outlined
                  item-color="accent"
                  label="سنة التخرج"
                  :rules="rules"
                  return-object
                ></v-select>
              </v-col>

              <v-col
                cols="12"
                xs="12"
                sm="12"
                :md="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
                :lg="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
                :xl="isLevelUpApi ? '6' : '4' || isGraduationApi ? '6' : '4'"
              >
                <v-menu
                  ref="orderDateMenu"
                  v-model="orderDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template #activator="{ on, attrs }">
                    <v-text-field
                      v-model="orderDate"
                      label="تاريخ الامر الاداري"
                      readonly
                      v-bind="attrs"
                      outlined
                      color="accent"
                      :rules="rules"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="orderDate"
                    header-color="primary"
                    :active-picker.sync="orderDatePicker"
                    :max="
                      new Date(
                        Date.now() - new Date().getTimezoneOffset() * 60000
                      )
                        .toISOString()
                        .substr(0, 10)
                    "
                    min="1950-01-01"
                    color="accent"
                    @change="saveOrderDate"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col
                v-if="!isLevelUpApi && !isGraduationApi"
                cols="12"
                sm="12"
                :md="orderStatus === 5 ? '6' : '12'"
                :lg="orderStatus === 5 ? '6' : '12'"
                :xl="orderStatus === 5 ? '6' : '12'"
              >
                <v-select
                  v-model="orderStatus"
                  :items="orderSelectStatus"
                  color="accent"
                  outlined
                  item-text="statusName"
                  item-value="idStudentStatus"
                  item-color="accent"
                  label="حالة الطالب"
                  :rules="rules"
                ></v-select>
              </v-col>

              <v-col
                v-if="orderStatus === 5 && !isLevelUpApi && !isGraduationApi"
                cols="12"
                :md="orderStatus === 5 ? '6' : '12'"
                :lg="orderStatus === 5 ? '6' : '12'"
                :xl="orderStatus === 5 ? '6' : '12'"
              >
                <v-select
                  v-model="exitCausesModel"
                  :items="exitCauses"
                  color="accent"
                  outlined
                  item-color="accent"
                  label="سبب الخروج"
                  :rules="rules"
                ></v-select>
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="orderDescription"
                  color="accent"
                  outlined
                  label="نص الامر الاداري"
                  :rules="rules"
                ></v-textarea>
              </v-col>
            </v-row>

            <v-btn
              block
              color="success"
              depressed
              large
              :disabled="!adminOrderForm"
              type="submit"
              class="primary--text"
            >
              حفظ المعلومات
            </v-btn>
          </v-form>
        </div>
      </v-card>
    </v-dialog>
    <!-- تعميم الامر الاداري -->

    <v-toolbar color="secondary" class="shadow-navbar mb-5 mt-5 rounded-1">
      <h4>تقارير الطلاب</h4>
      <v-spacer />
      <h4>عدد الطلاب: {{ studentsCount }}</h4>
    </v-toolbar>

    <v-dialog
      v-model="aprovDialog"
      persistent
      transition="slide-y-transition"
      max-width="750px"
    >
      <v-card color="primary" class="shadow-1 rounded-1">
        <v-toolbar color="secondary" class="shadow-1 rounded-1">
          <h4>تصديق الوثائق</h4>

          <v-spacer></v-spacer>

          <v-btn color="accent" icon @click="aprovDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div class="pa-5">
          <v-row>
            <v-col cols="12">
              <v-select
                v-model="certificateStatusId"
                :items="selectCertificatesStatus"
                item-value="idCertificateStatus"
                item-text="certificateStatusName"
                color="accent"
                outlined
                label="حالة الوثيقة"
                item-color="accent"
              ></v-select>
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="certificateStatusDescription"
                outlined
                color="accent"
                label="نص تصديق الوثيقة"
              ></v-textarea>
            </v-col>
          </v-row>
          <v-btn
            block
            color="success"
            depressed
            large
            type="submit"
            class="primary--text"
            @click="aprovTheCertificate"
          >
            حفظ المعلومات
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-card color="primary" class="shadow-navbar rounded-1">
      <div class="pa-10">
        <v-form
          ref="studentReportForm"
          lazy-validation
          @submit.prevent="createStudentReports"
        >
          <v-row>
            <v-col cols="12" sm="12" md="3" lg="3" xl="3">
              <v-text-field
                color="accent"
                outlined
                item-color="accent"
                label="اسم الطالب"
                name="studentName"
                clearable
                dense
                hide-details
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="12" md="3" lg="3" xl="3">
              <v-autocomplete
                :items="reportSelectSections"
                item-value="idSection"
                item-text="sectionName"
                color="accent"
                outlined
                item-color="accent"
                label="القسم"
                name="sectionId"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="3" lg="3" xl="3">
              <v-autocomplete
                :items="reportSelectRegisterYear"
                item-value="idYearStudy"
                item-text="year"
                color="accent"
                outlined
                item-color="accent"
                label="سنة القبول"
                name="registerYearId"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="3" lg="3" xl="3">
              <v-autocomplete
                :items="orderSelectLevel"
                item-value="value"
                item-text="text"
                color="accent"
                outlined
                item-color="accent"
                label="المرحلة"
                name="studentLevel"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-autocomplete
                :items="reportSelectAcceptedType"
                item-value="idAcceptedType"
                item-text="acceptedName"
                color="accent"
                outlined
                item-color="accent"
                label="نوع القبول"
                name="acceptedTypeId"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-autocomplete
                :items="reportSelectStudyType"
                item-value="value"
                item-text="text"
                color="accent"
                outlined
                item-color="accent"
                label="نوع الدراسة"
                name="studyType"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-autocomplete
                :items="reportSelectRegisterYear"
                item-value="idYearStudy"
                item-text="year"
                color="accent"
                outlined
                item-color="accent"
                label="سنة التخرج"
                name="graduationDate"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-autocomplete
                :items="reportSelectStatus"
                item-value="idStudentStatus"
                item-text="statusName"
                color="accent"
                outlined
                item-color="accent"
                label="الحالة"
                name="studentStatusId"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-autocomplete
                :items="exitCauses"
                color="accent"
                outlined
                item-color="accent"
                label="سبب الخروج"
                name="exitCauseTitle"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" sm="12" md="4" lg="4" xl="4">
              <v-autocomplete
                :items="selectGender"
                color="accent"
                outlined
                item-color="accent"
                label="الجنس"
                name="gender"
                clearable
                dense
                hide-details
              ></v-autocomplete>
            </v-col>
          </v-row>
          <v-btn
            block
            large
            color="success"
            depressed
            type="submit"
            class="mt-5"
          >
            انشاء التقرير
          </v-btn>
        </v-form>
      </div>
    </v-card>

    <v-toolbar color="secondary" class="shadow-navbar rounded-1 mb-5 mt-5">
      <h1>قيود الطلبة</h1>

      <v-spacer></v-spacer>
      <v-tooltip bottom color="accent" transition="slide-y-transition">
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            color="accent"
            class="primary--text ml-3"
            v-bind="attrs"
            v-on="on"
            @click="$router.push('/students/add')"
          >
            <v-icon>mdi-account-plus-outline</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">انشاء قيد جديد</span>
      </v-tooltip>

      <v-tooltip
        v-if="isStudentSelected && studentSelected.length > 0"
        bottom
        color="error"
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            color="error"
            class="primary--text ml-3"
            v-bind="attrs"
            v-on="on"
            @click="deleteStudent"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">حذف القيود</span>
      </v-tooltip>

      <v-tooltip
        v-if="isStudentSelected && studentSelected.length > 0"
        bottom
        color="accent"
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            color="accent"
            class="primary--text ml-3"
            v-bind="attrs"
            v-on="on"
            @click="aprovDialog = true"
          >
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">تصديق الوثائق</span>
      </v-tooltip>

      <v-tooltip
        v-if="isStudentSelected && studentSelected.length > 0"
        bottom
        color="accent"
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            color="accent"
            depressed
            class="primary--text ml-3"
            v-on="on"
            @click="
              adminOrderDialog = true
              openLevelUpDialog()
            "
          >
            <v-icon>mdi-sitemap</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">تعميم امر اداري</span>
      </v-tooltip>

      <v-tooltip
        v-if="isStudentSelected && studentSelected.length > 0"
        bottom
        color="accent"
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            color="accent"
            depressed
            class="primary--text ml-3"
            v-on="on"
            @click="
              isLevelUpApi = true
              adminOrderDialog = true
              openLevelUpDialog()
            "
          >
            <v-icon>mdi-export</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">ترحيل الطلاب</span>
      </v-tooltip>

      <v-tooltip
        v-if="isStudentSelected && studentSelected.length > 0"
        bottom
        color="accent"
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            v-bind="attrs"
            icon
            color="accent"
            depressed
            class="primary--text ml-3"
            v-on="on"
            @click="
              isGraduationApi = true
              adminOrderDialog = true
              openLevelUpDialog()
            "
          >
            <v-icon>mdi-logout</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">تخريج الطلاب</span>
      </v-tooltip>

      <v-tooltip
        v-if="students.length > 0"
        bottom
        color="accent"
        transition="slide-y-transition"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            icon
            color="accent"
            class="primary--text ml-3"
            v-bind="attrs"
            v-on="on"
            @click="
              tableExport('#studntsTable table', 'students', 'students.xls')
            "
          >
            <v-icon>mdi-download</v-icon>
          </v-btn>
        </template>
        <span class="primary--text">تصدير الجدول</span>
      </v-tooltip>
    </v-toolbar>

    <v-card id="tableWrapper" class="shadow-navbar rounded-1">
      <v-data-table
        id="studntsTable"
        v-model="studentSelected"
        :headers="headerToShow"
        :items="students"
        :search="search"
        :loading="tableLoading"
        :items-per-page="25"
        :show-select="showStudentSelectCheckBox"
        :custom-filter="customTableSearch"
        item-key="studentName"
        @dblclick:row="openProfile"
        @item-selected="selectStudent"
        @toggle-select-all="selectStudent"
      >
        <template #top>
          <v-toolbar class="shadow-navbar rounded-1 mb-8" color="primary">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="search"
                  append-icon="mdi-magnify"
                  label="بحث في القيود..."
                  single-line
                  hide-details
                  color="accent"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-toolbar>
        </template>

        <template #[`item.exitCauses`]="{ item }">
          <span>{{
            item.ExitCauses.length > 0
              ? item.ExitCauses[0].exitCausesTitle
              : 'لا يوجد'
          }}</span>
        </template>
      </v-data-table>
    </v-card>

    <a id="dlink" class="d-none" href="">Download</a>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import tableToExcel from '~/plugins/TableToExcel.js'
export default {
  data() {
    return {
      studentsCount: 0,
      search: '',
      loading: true,
      isLevelUpApi: false,
      isGraduationApi: false,
      graduationDate: '',
      searchStudentId: '',
      certificateStatusId: '',
      certificateStatusDescription: '',
      selectCertificatesStatus: [],
      aprovDialog: false,
      headers: [
        {
          text: 'الرقم الجامعي',
          sortable: false,
          align: 'right',
          value: 'collegeNumber',
          width: 200,
          selected: true,
        },
        {
          text: 'اسم الطالب',
          sortable: true,
          align: 'right',
          value: 'studentName',
          width: 200,
          selected: true,
        },
        {
          text: 'القسم',
          value: 'section',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'المرحلة',
          value: 'level',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'نوع الدراسة',
          value: 'studyType',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'حالة الطالب',
          value: 'studentStatus',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'سبب الخروج',
          value: 'exitCauses',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'سنة القبول',
          value: 'yearStudy',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'سنة التخرج',
          value: 'graduationDate',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'الجنس',
          value: 'gender',
          width: 200,
          sortable: false,
          selected: true,
        },
        {
          text: 'الاسم الانجليزي',
          value: 'englishName',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'بريد الطالب',
          value: 'mail',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'تاريخ الميلاد',
          value: 'dob',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'الشعبة',
          value: 'class',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'الجنسية',
          value: 'nationality',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'نوع القبول',
          value: 'acceptedType',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'المحافظة',
          value: 'province',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'المدرسة',
          value: 'schoolName',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'المعدل',
          value: 'average',
          width: 200,
          sortable: false,
          selected: false,
        },
        {
          text: 'تاريخ التخرج من المدرسة',
          value: 'studentGraduationDate',
          width: 200,
          sortable: false,
          selected: false,
        },
      ],
      students: [],
      searchStudent: [],
      tableLoading: true,
      isStudentSelected: false,
      studentSelected: [],

      // reports
      studentReportsDialog: false,

      studentReportForm: false,
      reportSelectSections: [],
      reportSelectRegisterYear: [],
      reportSelectStatus: [],
      reportSelectAcceptedType: [],
      reportSelectStudyType: [
        {
          text: 'صباحي',
          value: '1',
        },
        {
          text: 'مسائي',
          value: '0',
        },
      ],

      selectGender: [
        {
          text: 'انثى',
          value: '0',
        },
        {
          text: 'ذكر',
          value: '1',
        },
      ],
      // reports

      // admin orders
      adminOrderDialog: false,
      adminOrderForm: false,
      orderTitle: '',
      orderDescription: '',
      orderStatus: '',
      orderNumber: '',
      orderLevel: '',
      orderYear: null,
      orderDate: null,
      orderCreatedBy: '',
      orderDatePicker: null,
      orderDateMenu: false,
      orderNewLevel: '',
      orderNewClass: '',

      orderSelectTitle: [],
      orderSelectYear: [],
      orderSelectStatus: [],
      orderSelectLevel: [
        {
          text: 'المرحلة الاولى',
          value: 1,
        },
        {
          text: 'المرحلة الثانية',
          value: 2,
        },
        {
          text: 'المرحلة الثالثة',
          value: 3,
        },
        {
          text: 'المرحلة الرابعة',
          value: 4,
        },
        {
          text: 'المرحلة الخامسة',
          value: 5,
        },
        {
          text: 'متخرج',
          value: 10,
        },
      ],
      // admin orders

      rules: [(v) => !!v || 'لا يمكن ترك الحقل فارغ'],

      orderDateActivePicker: null,
      orderDateMenuModel: false,
      reportOrderTitleId: '',
      reportOrderNumber: '',
      reportOrderYear: '',
      reportOrderDate: null,
      orders: [],
      orderReportsForm: false,
      exitCauses: [
        'لا يوجد',
        'نقل',
        'ترقين قيد',
        'ترقين قيد بناءاّ على طلبه',
        'الغاء قبول',
        'رسوب بالغياب',
        'رسوب بالغش',
        'مزور',
        'تأجيل سنة',
      ],
      exitCausesModel: '',
      cloneHeaders: null,
      selectCategory: [],
      selectSubCategory: [],
      studentCategory: [],
      studentSubCategory: '',
      isSelectCategory: false,
      studySubCategoryId: '',
      studyYears: [],
      showSelectCheckBox: true,
    }
  },

  computed: {
    headerToShow() {
      return this.headers.filter((h) => h.selected)
    },

    showStudentSelectCheckBox() {
      return this.showSelectCheckBox
    },

    computedOrderSelectTitle() {
      let filterd
      if (this.isLevelUpApi) {
        filterd = this.orderSelectTitle.filter(function (order) {
          if (
            order.idOrderTitle === 52 ||
            order.idOrderTitle === 53 ||
            order.idOrderTitle === 54
          ) {
            return true
          }

          return false
        })
        return filterd
      } else if (this.isGraduationApi) {
        filterd = this.orderSelectTitle.filter(function (order) {
          if (
            order.idOrderTitle === 21 ||
            order.idOrderTitle === 22 ||
            order.idOrderTitle === 23 ||
            order.idOrderTitle === 447
          ) {
            return true
          }

          return false
        })
        return filterd
      } else {
        filterd = this.orderSelectTitle.filter((o) => {
          return (
            o.idOrderTitle !== 52 &&
            o.idOrderTitle !== 53 &&
            o.idOrderTitle !== 54 &&
            o.idOrderTitle !== 21 &&
            o.idOrderTitle !== 22 &&
            o.idOrderTitle !== 23 &&
            o.idOrderTitle !== 447
          )
        })
        return filterd
      }
    },
  },

  watch: {
    orderDateMenu(val) {
      val && setTimeout(() => (this.orderDatePicker = 'YEAR'))
    },

    orderDateMenuModel(val) {
      val && setTimeout(() => (this.orderDateActivePicker = 'YEAR'))
    },
  },

  created() {
    this.cloneHeaders = _.cloneDeep(this.headers)

    this.orderSelectTitle = this.$store.state.orderTitels

    this.orderSelectYear = this.$store.state.yearStudies
    const currentYear = this.$store.state.yearStudies.filter(
      (year) => year.currentYear === true
    )
    this.orderYear = currentYear[0]
    this.reportSelectRegisterYear = this.$store.state.yearStudies
    this.studyYears = this.$store.state.yearStudies

    this.reportSelectSections = this.$store.state.sections

    this.reportSelectStatus = this.$store.state.studentsStatus
    this.orderSelectStatus = this.$store.state.studentsStatus

    this.reportSelectAcceptedType = this.$store.state.acceptedTypes

    this.selectCategory = this.$store.state.studyCategories

    this.orderDate = moment(new Date().toLocaleString()).format('YYYY-MM-DD')

    this.$axios.get('certificatesStatus').then((status) => {
      this.selectCertificatesStatus = status.data
    })
  },

  methods: {
    openLevelUpDialog() {
      // this.orderNewLevel = this.studentSelected[0].level[0].value
    },

    customTableSearch(value, search, items) {
      return items.studentName.toString().startsWith(search)
    },

    resetFilterAndTableSettinges() {
      this.headers = this.cloneHeaders
    },

    categorySelected(category) {
      this.selectSubCategory = category.StudySubCategory
      this.isSelectCategory = true
    },

    convertIntToText(int) {
      let str = {}
      if (int === 1) {
        str = {
          text: 'المرحلة الاولى',
          value: 1,
        }
      } else if (int === 2) {
        str = {
          text: 'المرحلة الثانية',
          value: 2,
        }
      } else if (int === 3) {
        str = {
          text: 'المرحلة الثالثة',
          value: 3,
        }
      } else if (int === 4) {
        str = {
          text: 'المرحلة الرابعة',
          value: 4,
        }
      } else if (int === 5) {
        str = {
          text: 'المرحلة الخامسة',
          value: 5,
        }
      } else {
        str = {
          text: 'متخرج',
          value: 10,
        }
      }

      return str
    },

    selectStudent(item) {
      // select all
      if (item.items && item.value === true) {
        this.studentSelected = item.items
        this.isStudentSelected = true
      }

      // select one
      else if (item.items === undefined && item.value === true) {
        this.studentSelected.push(item.item)
        this.isStudentSelected = true
      }
    },

    saveOrderDate(date) {
      this.$refs.orderDateMenu.save(date)
    },

    saveOrderDateModel(date) {
      this.$refs.orderDateMenuModel.save(date)
    },

    createAdminOrders() {
      if (this.$refs.adminOrderForm.validate()) {
        this.$toast.show('جاري تعميم الامر الاداري', {
          duration: 3000,
          position: 'top-center',
        })

        const orders = []
        if (this.isLevelUpApi) {
          for (let i = 0; i < this.studentSelected.length; i++) {
            const info = {
              orderTitleId: this.orderTitle.idOrderTitle,
              orderNumber: this.orderNumber,
              orderDescription: this.orderDescription,
              orderYear: this.orderYear.idYearStudy * 1,
              orderLevel: this.orderLevel.value,
              studentId: this.studentSelected[i].idStudent,
              level: this.orderNewLevel,
              class: this.studentSelected[i].studentLevel[0].class,
              studentStatusId: 1,
              orderDate: new Date(
                moment(this.orderDate).format('YYYY-MM-DD hh:mm:ss')
              ),
              // createdBy: 1,
              createdBy: this.$auth.user.idUser,
            }

            orders.push(info)
          }

          this.$axios
            .post('addOrderLevels', orders)
            .then((result) => {
              this.$toast.success('تم تعميم الامر الاداري', {
                duration: 3000,
                position: 'top-center',
              })
              this.adminOrderDialog = false
              this.isLevelUpApi = false
            })
            .catch((err) => {
              this.$toast.error('حدث خطأ في تعميم الامر الاداري', {
                duration: 15000,
                position: 'top-center',
              })
              this.adminOrderDialog = false
              this.isLevelUpApi = false
              console.error(err.response)
            })
        } else if (this.isGraduationApi) {
          for (let i = 0; i < this.studentSelected.length; i++) {
            const info = {
              orderTitleId: this.orderTitle.idOrderTitle,
              orderNumber: this.orderNumber,
              orderDescription: this.orderDescription,
              orderYear: this.orderYear.idYearStudy * 1,
              orderLevel: this.orderLevel.value,
              studentId: this.studentSelected[i].idStudent,
              level: 10,
              class: this.studentSelected[i].studentLevel[0].class,
              studentStatusId: 3,
              orderDate: new Date(
                moment(this.orderDate).format('YYYY-MM-DD hh:mm:ss')
              ),
              createdBy: this.$auth.user.idUser,
            }

            orders.push(info)
          }

          this.$axios
            .post('addOrderLevels', orders)
            .then((result) => {
              this.$toast.success('تم تعميم الامر الاداري', {
                duration: 3000,
                position: 'top-center',
              })
              this.adminOrderDialog = false
              this.isGraduationApi = false
            })
            .catch((err) => {
              this.$toast.error('حدث خطأ في تعميم الامر الاداري', {
                duration: 15000,
                position: 'top-center',
              })
              this.adminOrderDialog = false
              this.isGraduationApi = false
              console.error(err.response)
            })
        } else {
          for (let i = 0; i < this.studentSelected.length; i++) {
            const info = {
              orderTitleId: this.orderTitle.idOrderTitle,
              orderNumber: this.orderNumber,
              orderDescription: this.orderDescription,
              orderYear: this.orderYear.idYearStudy * 1,
              orderLevel: this.orderLevel.value,
              studentId: this.studentSelected[i].idStudent,
              studentStatusId: this.orderStatus,
              orderDate: new Date(
                moment(this.orderDate).format('YYYY-MM-DD hh:mm:ss')
              ),
              createdBy: this.$auth.user.idUser,
            }

            orders.push(info)
          }

          this.$axios
            .post('addAdministrativeOrders', orders)
            .then(() => {
              this.$toast.success('تم تعميم الامر الاداري', {
                duration: 3000,
                position: 'top-center',
              })
              this.adminOrderDialog = false
              this.isLevelUpApi = false
              this.isGraduationApi = false

              if (orders[0].studentStatusId === 5) {
                const exitCauses = []
                for (let i = 0; i < this.studentSelected.length; i++) {
                  const info = {
                    exitCausesTitle: this.exitCausesModel,
                    studentId: this.studentSelected[i].idStudent,
                    createdBy: this.$auth.user.idUser,
                  }

                  exitCauses.push(info)
                }

                console.log(exitCauses)
                this.$axios.post('addManyExitCauses', exitCauses)
              }
            })
            .catch((err) => {
              this.$toast.error('حدث خطأ في تعميم الامر الاداري', {
                duration: 15000,
                position: 'top-center',
              })
              this.adminOrderDialog = false
              this.isLevelUpApi = false
              console.error(err.response)
            })
        }
      }
    },

    async createStudentReports(event) {
      if (this.$refs.studentReportForm.validate()) {
        try {
          const data = Object.fromEntries(new FormData(event.target))
          const filters = {}
          this.$nuxt.$loading.start()

          if (data.studentName) {
            filters.studentName = data.studentName
          }

          if (data.sectionId) {
            filters.sectionId = data.sectionId
          }

          if (data.registerYearId) {
            filters.registerYearId = data.registerYearId
          }

          if (data.studentStatusId) {
            filters.studentStatusId = data.studentStatusId
          }

          if (data.studyType) {
            filters.studyType = data.studyType
          }

          if (data.acceptedTypeId) {
            filters.acceptedTypeId = data.acceptedTypeId
          }

          if (data.studentLevel) {
            filters.studentLevel = data.studentLevel
          }

          if (data.graduationDate) {
            filters.studentGraduation = data.graduationDate
          }

          if (data.gender) {
            filters.gender = data.gender
          }

          if (data.studySubCategoryId) {
            filters.subCategoryId = data.studySubCategoryId
          }

          if (data.exitCauseTitle) {
            filters.exitCauseTitle = data.exitCauseTitle
          }

          const queryString = Object.keys(filters)
            .map(
              (key) =>
                encodeURIComponent(key) + '=' + encodeURIComponent(filters[key])
            )
            .join('&')

          if (queryString === '') {
            this.$nuxt.$loading.finish()
            this.$toast.error('يرجى اختيار محددات', {
              duration: 3000,
              position: 'top-center',
            })
          } else {
            const students = await this.$axios.get(`getStudents?${queryString}`)

            let studentData = []
            if (queryString === '') {
              studentData = students.data.filter(
                (student) => this.$auth.user.sectionId === student.sectionId
              )
            } else {
              studentData = students.data
            }

            this.studentsCount = studentData.length
            console.log(students.data)
            this.students = studentData.reverse().map((student) => {
              const levelText = this.convertIntToText(
                student.studentLevel[student.studentLevel.length - 1].level
              ).text
              return {
                ...student,
                ExitCauses: student.ExitCauses,
                collegeNumber: student.collegeNumber,
                studentName: student.studentName,
                englishName: student.englishName,
                section: student.section.sectionName,
                studentStatus: student.studentStatus.statusName,
                province:
                  student.address !== null
                    ? student.address.province.provinceName
                    : '',
                gender: student.gender ? 'ذكر' : 'انثى',
                mail: student.mail,
                nationality: student.nationality,
                studyType: student.studyType ? 'صباحي' : 'مسائي',
                yearStudy: student.yearStudy.year,
                dob: student.dob,
                acceptedType: student.acceptedType.acceptedName,
                schoolName:
                  student.studentSchool !== null
                    ? student.studentSchool.schoolName
                    : '',
                studentGraduationDate:
                  student.studentSchool !== null
                    ? student.studentSchool.yearStudy.year
                    : 'لا يوجد',
                average:
                  student.studentSchool !== null
                    ? student.studentSchool.average
                    : '',
                level: levelText,
                class: student.studentLevel.map((std) => {
                  return std.class
                }),
                graduationDate:
                  student.studentGraduation !== null
                    ? student.studentGraduation.yearStudy.year
                    : 'لا يوجد',
              }
            })
            this.tableLoading = false
            this.studentReportsDialog = false
            this.$nuxt.$loading.finish()
          }
        } catch (e) {
          console.error(e.response)
        }
      }
    },

    tableExport(id, name, file) {
      tableToExcel(id, name, file)
    },

    openProfile(event, item) {
      const { idStudent } = item.item
      const parent = event.target.parentElement
      parent.classList.add('visited')
      window.open(
        `/students/profile/${idStudent}`,
        '_blank',
        'location=yes,height=1200,width=1500,scrollbars=yes,status=yes'
      )
      // this.$router.push(`/students/profile/${idStudent}`)
    },

    async deleteStudent() {
      if (confirm('هل تريد حذف القيد ؟')) {
        const { idStudent } = this.studentSelected[0]

        try {
          const deleteStudents = await this.$axios.delete(
            `student/${idStudent}`
          )

          this.$toast.success('تم حذف القيد', {
            duration: 3000,
            position: 'top-center',
          })
          console.log(deleteStudents.data)
        } catch (error) {
          console.log(error)
        }
      }
    },

    async aprovTheCertificate() {
      try {
        const aprov = await this.$axios.put('manyStudentSchool', {
          certificateStatusId: this.certificateStatusId,
          certificateStatusDescription: this.certificateStatusDescription,
          ids: this.studentSelected.map((student) => student.idStudent),
        })

        console.log(aprov)
        this.$toast.success('تم تصديق الوثائق', {
          duration: 3000,
          position: 'top-center',
        })
        this.aprovDialog = false
      } catch (error) {
        console.log(error)
      }
    },
  },
}
</script>

<style lang="scss">
.disabled_row_students {
  // pointer-events: none !important;

  * {
    color: #898989 !important;
  }
}

.visited {
  background: rgba(black, 0.3);

  * {
    color: var(--v-primary-text) !important;
  }
}
</style>
