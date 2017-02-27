<template>
    <div>
        <!-- 0 - 50% green -->
        <v-progress-linear v-if="value <= green" v-model="value" success></v-progress-linear>
        <!-- 51% - 70% blue -->
        <v-progress-linear v-if="value > green && value <= blue" v-model="value" info></v-progress-linear>
        <!-- 71 - 85% yellow-->
        <v-progress-linear v-if="value > blue && value <= yellow" v-model="value" warning></v-progress-linear>
        <!-- 86 - 100% red-->
        <v-progress-linear v-if="value > yellow" v-model="value" error></v-progress-linear>
    </div>
</template>
<script>
    export default {
        name: 'progress-linear-color',
        props: {
            value: {
                type: [Number, String],
                default: 0
            },
            green: {
                type: [Number],
                default: 50
            },
            blue: {
                type: [Number],
                default: 70
            },
            yellow: {
                type: [Number],
                default: 85
            },
            red: {
                type: [Number],
                default: 100
            }
        }
    }
</script>
