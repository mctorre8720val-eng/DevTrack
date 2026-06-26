import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './firebase'

export function registerUser(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export function loginUser(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logoutUser() {
  return signOut(auth)
}

export function observeAuthState(callback) {
  return onAuthStateChanged(auth, callback)
}
