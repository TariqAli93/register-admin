<template>
  <div class="profile-page">
    <v-toolbar class="shadow-navbar rounded-1 mt-5" color="secondary">
      <v-toolbar-title>{{ student.studentName }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-tooltip bottom color="error" transition="slide-y-transition">
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
        <span class="primary--text">حذف القيد</span>
      </v-tooltip>

      <v-btn icon color="accent" @click="$router.push('/students')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
    </v-toolbar>

    <v-card color="secondary" class="shadow-1 rounded-1 mt-5">
      <v-tabs v-model="tabs" center-active color="accent" grow centered right>
        <v-tab>المعلومات الاساسية</v-tab>
        <v-tab>معلومات ولي الامر</v-tab>
        <v-tab>معلومات المدرسة</v-tab>
        <v-tab>معلومات السكن</v-tab>
        <v-tab>الاوامر الادارية</v-tab>
        <v-tab>الصورة الشخصية و الوثيقة</v-tab>

        <v-tabs-items v-model="tabs" class="pa-5 border-top">
          <v-tab-item>
            <ProfileTabsOne :student-id="Number($route.params.id)" />
          </v-tab-item>

          <v-tab-item>
            <ProfileTabsTwo :student-id="Number($route.params.id)" />
          </v-tab-item>

          <v-tab-item>
            <ProfileTabsThree :student-id="Number($route.params.id)" />
          </v-tab-item>

          <v-tab-item>
            <ProfileTabsFour :student-id="Number($route.params.id)" />
          </v-tab-item>

          <v-tab-item>
            <ProfileTabsFive :student-id="Number($route.params.id)" />
          </v-tab-item>

          <v-tab-item>
            <ProfileTabsSix :student-id="Number($route.params.id)" />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import eventHub from '@/plugins/bus.js'
export default {
  data() {
    return {
      tabs: null,
      student: {},
    }
  },

  mounted() {
    this.getStudents()
  },

  methods: {
    async getStudents() {
      const { id } = this.$route.params
      try {
        const student = await this.$axios.get(`student/${id}`)
        this.student = student.data
      } catch (e) {
        console.error(e)
      }
    },

    async deleteStudent() {
      if (confirm('هل تريد حذف القيد ؟')) {
        const { id } = this.$route.params

        this.$toast.success('تم حذف القيد', {
          duration: 3000,
          position: 'top-center',
        })

        try {
          const deleteStudents = await this.$axios.delete(`student/${id}`)
          console.log(deleteStudents.data)
          eventHub.$emit('deletedStudents')
          window.close()
        } catch (error) {
          console.log(error)
        }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.border-top {
  border-top: 1px solid rgba($primary, 0.4);
}
</style>