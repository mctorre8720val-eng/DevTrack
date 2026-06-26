import { setDoc, doc } from 'firebase/firestore'
import { db } from '../src/services/firebase.js'

async function run() {
  try {
    const uid = `presence-test-${Date.now()}`
    const ref = doc(db, 'Presence', uid)
    await setDoc(ref, { online: true, lastSeen: new Date().toISOString() })
    console.log('PRESENCE_OK', uid)
  } catch (err) {
    console.error('PRESENCE_ERR', err && err.toString ? err.toString() : err)
    process.exitCode = 1
  }
}

run()
