import { createDocument, getCollection, getDocument, updateDocument, deleteDocument } from './firestoreService'

const COLLECTION = 'Projects'

export function createProject(data) {
  return createDocument(COLLECTION, data)
}

export async function getProjectsByOwner(ownerId) {
  const all = await getCollection(COLLECTION)
  return all.filter((p) => p.ownerId === ownerId)
}

export function getProject(id) {
  return getDocument(COLLECTION, id)
}

export function updateProject(id, data) {
  return updateDocument(COLLECTION, id, data)
}

export function deleteProject(id) {
  return deleteDocument(COLLECTION, id)
}
