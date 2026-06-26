import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore'
import { db } from './firebase'

export function createDocument(collectionName, data) {
  const collectionRef = collection(db, collectionName)
  return addDoc(collectionRef, data)
}

export async function getCollection(collectionName) {
  const collectionRef = collection(db, collectionName)
  const snapshot = await getDocs(collectionRef)
  return snapshot.docs.map((docItem) => ({ id: docItem.id, ...docItem.data() }))
}

export async function getDocument(collectionName, id) {
  const docRef = doc(db, collectionName, id)
  const snapshot = await getDoc(docRef)
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null
}

export function updateDocument(collectionName, id, data) {
  const docRef = doc(db, collectionName, id)
  return updateDoc(docRef, data)
}

export function deleteDocument(collectionName, id) {
  const docRef = doc(db, collectionName, id)
  return deleteDoc(docRef)
}
