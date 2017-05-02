<template>
    <div>
        <v-alert warning>
            {{$t('ticket.response_time')}}
        </v-alert>
        <div class="mb-4"></div>
        <h4>
            <v-chip v-if="!ticket.closed_at && !ticket.staff_response_needed" label
                    class="blue white--text" v-tooltip:bottom="{ html: $t('ticket.status.waiting.long') }">
                {{$t('ticket.status.waiting.medium')}}
            </v-chip>
            <v-chip v-if="!ticket.closed_at && ticket.staff_response_needed" label
                    class="yellow" v-tooltip:bottom="{ html: $t('ticket.status.working.long') }">
                {{$t('ticket.status.working.medium')}}
            </v-chip>
            <v-chip v-if="ticket.closed_at" label
                    class="red white--text" v-tooltip:bottom="{ html: $t('ticket.status.closed.long') }">
                {{$t('ticket.status.closed.medium')}}
            </v-chip>
            {{$t('ticket.subject')}}: {{ticket.subject}}
        </h4>
        <v-card class="grey lighten-4" id="ticket-topic">
            <v-card-row actions class="blue">
                <v-btn flat class="white--text">
                    <v-icon class="white--text">face</v-icon>
                    <div class="ml-2"></div>
                    {{$t('ticket.client')}}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn flat class="white--text">
                    <v-icon class="white--text">event</v-icon>
                    <div class="mr-1"></div>
                    {{ticket.created_at | prettyDateTime}}
                </v-btn>
            </v-card-row>
            <v-card-text>
                <div v-html="ticket.message">
                </div>
            </v-card-text>
        </v-card>
        <div class="mt-4"></div>
        <div v-for="tmsg in messages.messages" id="ticket-messages">
            <v-card class="grey lighten-4">
                <v-card-row actions class="green" v-if="tmsg.staff">
                    <v-btn flat class="white--text">
                        <v-icon class="white--text">grade</v-icon>
                        <div class="ml-2"></div>
                        {{$t('ticket.staff')}}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat class="white--text">
                        <v-icon class="white--text">event</v-icon>
                        <div class="mr-1"></div>
                        {{tmsg.created_at | prettyDateTime}}
                    </v-btn>
                </v-card-row>
                <v-card-row actions class="blue" v-if="!tmsg.staff">
                    <v-btn flat class="white--text">
                        <v-icon class="white--text">face</v-icon>
                        <div class="ml-2"></div>
                        {{$t('ticket.client')}}
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat class="white--text">
                        <v-icon class="white--text">event</v-icon>
                        <div class="mr-1"></div>
                        {{tmsg.created_at | prettyDateTime}}
                    </v-btn>
                </v-card-row>
                <v-card-text>
                    <div v-html="tmsg.message">
                    </div>
                </v-card-text>
            </v-card>
            <br>
        </div>
        <div v-if="!ticket.closed_at">
            <v-text-field
                :label="$t('ticket.textarea')"
                :disabled="textLock"
                multi-line
                v-model="msg"
                counter
                max="3000"
            ></v-text-field>
            <v-btn v-if="msg.length >= 0 && msg.length <= 1"
                   @click.native="addTicketMessage(msg)"
                   grey
                   block>{{$t('ticket.send')}}
            </v-btn>
            <v-btn v-if="msg.length <= 3000 && msg.length >= 2"
                   @click.native="addTicketMessage(msg)"
                   success
                   block>{{$t('ticket.send')}}
            </v-btn>
            <v-btn v-if="msg.length > 3000"
                   @click.native="addTicketMessage(msg)"
                   error
                   block>{{$t('ticket.send')}}
            </v-btn>
        </div>
        <div class="mt-5"></div>
    </div>
</template>
<script>
    export default {
        name: 'ticket-messages',
        data () {
            return {
                msg: ''
            }
        },
        props: {
            ticket: {
                type: Object
            },
            messages: {
                type: [Object, Array]
            },
            message: {
                type: String,
                default: ""
            },
            textLock: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            msg(val, oldVal) {
                this.$emit('input', val)
            },
            textLock(val, oldVal) {
                if (!val && oldVal) this.msg = ''
            }
        },
        methods: {
            addTicketMessage(val) {
                this.newMessageDisabled = true
                this.$emit('newMessage', val)
            }
        }
    }
</script>
