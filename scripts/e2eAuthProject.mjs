import firebaseConfig from '../src/services/firebaseConfig.js'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../src/services/firebase.js'

async function run() {
  try {
    const email = `e2e+${Date.now()}@example.com`
    const password = 'Test1234!'
    const apiKey = firebaseConfig.apiKey

    const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true })
    })

    const data = await resp.json()
    if (!resp.ok) {
      console.error('AUTH_ERR', data)
      process.exitCode = 2
      return
    }

    console.log('AUTH_OK', data.localId)

    const docRef = await addDoc(collection(db, 'Projects'), {
      title: 'e2e-project',
      ownerId: data.localId,
      createdAt: Date.now(),
      source: 'e2eAuthProject'
    })

    console.log('PROJECT_OK', docRef.id)
  } catch (err) {
    console.error('ERR', err && err.toString ? err.toString() : err)    
    process.exitCode = 1
  }
}

run()
