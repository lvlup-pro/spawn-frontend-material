<template>
    <div>
        <!-- hidden checkbox for validation - strange workaround !-->
        <input v-model="internalValue" v-validate="rules" :name="name" style="display: none;">
        <v-text-field
            v-model="internalValue"
            :class="{'input-group--error': hasError }"
            :type="type"
            :label="label"
            :placeholder="placeholder"
            :rules="[getError]"
        ></v-text-field>
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
            value: {
                default: ''
            },
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
                this.$validator.remove(this.name)
                this.$validator.extend(this.name, {
                    getMessage: function() { return self.validationmessage },
                    validate: (value) => new Promise(resolve => {
                        resolve(self.validation())
                    })
                })
            }
        },
        data: function () {
            return {
                internalValue: ''
            }
        },
        computed: {
            rules() {
                if (this.validation == null) {
                    return { rules: { required: this.required, email: this.email } }
                } else {
                    let rules = { required: this.required, email: this.email }
                    rules[this.name] = this.validation
                    return { rules: rules }
                }
            },
            email() {
                return this.type === 'email'
            },
            hasError() {
                return this.verrors.has(this.name)
            }
        },
        methods: {
            getError() {
                if (this.hasError) {
                    return this.verrors.first(this.name)
                } else {
                    return true
                }
            }
        },
        watch: {
            internalValue: function(newValue, oldValue) {
                this.$emit('input', newValue)
            },
            value: function(newValue, oldValue) {
                this.internalValue = newValue
            }
        }
    }
</script>
