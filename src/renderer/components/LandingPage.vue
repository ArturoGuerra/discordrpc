<template>
  <div class='container'>
    <span class="title">
      Details
    </span>
    <input v-model='details' type=text>
    <span class="title">
      State
    </span>
    <input v-model='state' type=text>
    <span class="title">
      Large Key
    </span>
    <input v-model='large_key' type=text>
    <span class="title">
      Large Text
    </span>
    <input v-model='large_text' type=text>
    <span class="title">
      Small Key
    </span>
    <input v-model='small_key' type=text>
    <span class="title">
      Small Text
    </span>
    <input v-model='small_text' type=text>
    <span class="title">
      Client ID
    </span>
    <input v-model='client_id' type=text>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
import storage from 'electron-json-storage'
export default {
  name: 'landing-page',
  data () {
    return {
      details: null,
      state: null,
      small_key: null,
      large_key: null,
      small_text: null,
      large_text: null,
      client_id: null
    }
  },
  methods: {
    start () {
      ipcRenderer.send('asynchronous-message',
        {
          client_id: this.client_id,
          rpc: {
            details: this.details,
            state: this.state,
            largeImageKey: this.large_key,
            largeImageText: this.large_text,
            smallImageKey: this.small_key,
            smallImageText: this.small_text
          }
        }
      )
      console.log('Sent RPC Payload Waiting..')
    },
    save () {
      this.start()
      storage.set('rpc',
        {
          details: this.details,
          state: this.state,
          small_key: this.small_key,
          large_key: this.large_key,
          small_text: this.small_text,
          large_text: this.large_text,
          client_id: this.client_id
        },
        (err) => { if (err) console.log('Error: ' + err) }
      )
    }
  },
  created () {
    /* Get reply from main process */
    ipcRenderer.on('asynchronous-reply', (event, args) => { console.log(args) })
    /* Get data from localstorage */
    storage.get('rpc', (error, data) => {
      if (error) {
        console.log(error)
      }
      if (data) {
        console.log(data)
        this.client_id = data.client_id
        this.details = data.details
        this.state = data.state
        this.small_key = data.small_key
        this.large_key = data.large_key
        this.large_text = data.large_text
        this.small_text = data.small_text
      }
    })
  },
  watch: {
    'client_id': function () {
      if ((this.client_id.match(/^\d+$/)) && (this.client_id.length >= 16)) {
        this.save()
        console.log('Valid ID: ' + this.client_id)
      } else {
        console.log('Invalid ID: ' + this.client_id)
      }
    },
    'details': function () {
      this.save()
    },
    'state': function () {
      this.save()
    },
    'small_key': function () {
      this.save()
    },
    'small_text': function () {
      this.save()
    },
    'large_key': function () {
      this.save()
    },
    'large_text': function () {
      this.save()
    }
  }
}
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  body { font-family: 'Source Sans Pro', sans-serif; }

  .container {
    display: grid;
    min-width: 100vh;
    max-width: 228px;
    padding-left: auto;
    padding-right: auto;
    padding-top: 4px;
    padding-bottom: 4px;
  }

  input {
    padding: 2px 2px 2px 2px;
    width: 200px;
  }

  span {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
    width: 200px;
  }

  a {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
    width: 200px;
  }
</style>
