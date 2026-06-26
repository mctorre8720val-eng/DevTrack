import { collection, addDoc } from 'firebase/firestore'
import { db } from '../src/services/firebase.js'

async function run() {
  try {
    const docRef = await addDoc(collection(db, 'Projects'), {
      title: 'smoke-test',
      createdAt: new Date().toISOString(),
      source: 'smokeTestScript'
    })
    console.log('WRITE_OK', docRef.id)
  } catch (err) {
    console.error('WRITE_ERR', err && err.toString ? err.toString() : err)
    process.exitCode = 1
  }
}

run()
