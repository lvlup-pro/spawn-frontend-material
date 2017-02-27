<template>
    <div>
        <v-text-input
            v-validate="rules"
            v-model="value"
            :class="{'custom-text-input': true, 'validation-error': errors.has(name) }"
            :type="type"
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
                default: ''
            },
            type: {
                type: [String],
                default: 'text'
            },
            validation: {
                type: [Function],
                default: null
            },
            validationmessage: {
                type: [String],
                default: ''
            }
        },
        created() {
            let self = this
            if (this.validation != null) {
                this.$validator.extend('custom', {
                    getMessage: function() { return self.validationmessage },
                    validate: (value) => new Promise(resolve => {
                        resolve(this.validation())
                    })
                })
            }
        },
        data: function () {
            return {
                value: ''
            }
        },
        computed: {
            rules() {
                if (this.validation == null) {
                    return { rules: { required: this.required, email: this.email } }
                } else {
                    return { rules: { required: this.required, email: this.email, custom: this.validation } }
                }
            },
            email() {
                return this.type === 'email'
            }
        },
        watch: {
            'value': function(newValue, oldValue) {
                this.$emit('input', newValue)
            }
        }
    }
</script>
