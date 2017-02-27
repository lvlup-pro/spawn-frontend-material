<template>
    <div>
        <v-text-input
            v-validate="rules"
            :class="{'custom-text-input': true, 'validation-error': errors.has(name) }"
            :label="label"
            :placeholder="placeholder"
            :name="name"
        ></v-text-input>
        <span class="validation-error" v-show="errors.has(name)">{{ errors.first(name) }}</span>
    </div>
</template>
<style>
    div.custom-text-input {
        margin-bottom: 2rem;
    }

    div.custom-text-input.validation-error::after {
        background-color: red;
        width: 100%;
    }

    span.validation-error {
        color: red;
        font-size: 0.8rem;
        position: absolute;
        margin-top: -2rem;
        padding-top: 2px;
    }
</style>
<script>
    export default {
        name: 'text-input',
        props: {
            required: {
                type: [Boolean],
                default: true
            },
            email: {
                type: [Boolean],
                default: false
            },
            name: {
                type: [String],
                required: true
            },
            label: {
                type: [String],
                required: true
            },
            placeholder: {
                type: [String],
                default: ""
            }
        },
        computed: {
            rules() {
                return { rules: { required: this.required, email: this.email } }
            }
        }
    }
</script>
