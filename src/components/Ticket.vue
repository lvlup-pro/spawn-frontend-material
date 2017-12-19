<template>
  <v-container>

    <v-layout row wrap>
      <v-flex xs12 lg8 offset-lg2>

        <div class="display-3 grey--text text--darken-1">{{ $t('ticket') }} #{{ id }}

          <v-chip label color="green" text-color="white" v-if="!ticket.closed_at">
            <!--<v-icon left>label</v-icon>-->
            {{ $t('open') }}
          </v-chip>
          <v-chip label color="green" text-color="white" v-if="ticket.closed_at">
            {{ $t('closed') }}
          </v-chip>
          <v-chip label color="green" text-color="white" v-if="ticket.staff_response_needed">
            {{ $t('inProgress') }}
          </v-chip>
          <v-chip label color="blue" text-color="white" v-else>
            {{ $t('clientResponseNeeded') }}
          </v-chip>

        </div>

        <div class="headline grey--text text--darken-1">{{ ticket.subject }}</div>
        <br>

        <v-layout row wrap>
          <v-flex xs12>

            <!-- first message from client in ticket -->
            <v-toolbar color="blue" dark dense>
              <v-icon class="white--text">face</v-icon>
              <!--<v-toolbar-title>{{ $t('you') }}</v-toolbar-title>-->
              <div>{{ $t('you') }}</div>
              <v-spacer></v-spacer>
              <v-icon class="white--text">event</v-icon>
              <div>{{ ticket.created_at | prettyDateTime }}</div>
              <!--<v-toolbar-title>{{ ticket.created_at | prettyDateTime }}</v-toolbar-title>-->
              <!--
              <v-btn icon>
                <v-icon>favorite</v-icon>
              </v-btn>
              -->
            </v-toolbar>
            <v-card color="grey lighten-4">
              <v-card-text>
                {{ ticket.message }}
              </v-card-text>
            </v-card>

            <!-- each other message in ticket -->
            <div v-for="msg in messages">
              <v-toolbar :color="ticketHeaderColor(msg.staff)" dark dense class="mt-4">
                <v-icon v-if="msg.staff" class="white--text">star</v-icon>
                <v-icon v-if="!msg.staff" class="white--text">face</v-icon>
                <div v-if="msg.staff">{{ $t('staff') }}</div>
                <div v-if="!msg.staff">{{ $t('you') }}</div>
                <v-spacer></v-spacer>
                <v-icon class="white--text">event</v-icon>
                <div>{{ msg.created_at | prettyDateTime }}</div>
              </v-toolbar>
              <v-card color="grey lighten-4">
                <v-card-text>
                  {{ msg.message }}
                </v-card-text>
              </v-card>
            </div>

            <br>

            <v-text-field
              :label="$t('messageHint')"
              multi-line
              v-model="message"
              :disabled="sendingMessagePaused"
            ></v-text-field>

            <v-btn
              block
              color="blue"
              dark
              v-if="!sendingMessagePaused && messageLengthOk"
              @click="sendMessage()"
            >
              {{ $t('sendMessage') }}
            </v-btn>
            <v-btn
              block
              color="gray"
              v-else
            >
              {{ $t('sendMessage') }}
            </v-btn>

          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
  import axios from 'axios'

  export default {
    i18n: {
      messages: {
        en: {
          ticket: 'Ticket',
          you: 'You',
          staff: 'lvlup.pro',
          open: 'Open',
          inProgress: 'In progress',
          clientResponseNeeded: 'Client response needed',
          messageHint: 'Type your message here',
          sendMessage: 'Send'
        },
        pl: {
          ticket: 'Ticket',
          you: 'Ty',
          staff: 'lvlup.pro',
          open: 'Otwarty',
          inProgress: 'W toku',
          clientResponseNeeded: 'Potrzebna odpowiedź klienta',
          messageHint: 'Tu wpisz swoją wiadomość',
          sendMessage: 'Wyślij'
        }
      }
    },
    data() {
      return {
        ticket: {},
        messages: {},
        message: '',
        sendingMessagePaused: true
      }
    },
    mounted() {
      this.$store.dispatch('whenMounted');
      this.getTicketInfo()
      this.getTicketMessages()
    },
    computed: {
      id() {
        return this.$route.params.id
      },
      messageLengthOk() {
        if (this.message.length >= 2) {
          return true
        } else {
          return false
        }
      }
    },
    methods: {
      ticketHeaderColor(staff) {
        if (staff) {
          return "green"
        } else {
          return "blue"
        }
      },
      getTicketInfo() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'help/ticket/' + this.id
        }).then((res) => {
          this.ticket = res.data
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      getTicketMessages() {
        axios({
          method: 'get',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'help/ticket/' + this.id + '/message'
        }).then((res) => {
          this.messages = res.data.messages
          this.sendingMessagePaused = false
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      },
      sendMessage() {
        this.sendingMessagePaused = true
        axios({
          method: 'post',
          headers: {'Authorization': 'Bearer ' + localStorage.getItem('token')},
          url: this.$config.apiUrl + 'help/ticket/' + this.id + '/message',
          data: {
            msg: this.message
          }
        }).then((res) => {
          this.getTicketMessages()
          this.message = ''
          this.sendingMessagePaused = false
        }).catch((err) => {
          if (err.response.status === 401) {
            this.$store.dispatch('setLoggedOut')
          }
        })
      }
    }
  }
</script>
