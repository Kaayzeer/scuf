//firestore
import {
  db,
  getDocs,
  doc,
  collection,
  query,
  setDoc,
  addDoc,
  deleteDoc,
  where,
} from "./firebaseSetup";

export const getDocuments = async (collectionName) => {
  const q = query(collection(db, collectionName));
  const querySnapshot = await getDocs(q);
  let docsArr = [];
  querySnapshot.docs.forEach((doc) => {
    docsArr.push({ id: doc.id, ...doc.data() });
  });
  return docsArr;
};

export const updateDocument = async (collectionName, itemId, updatedItem) => {
  const resp = await setDoc(doc(db, collectionName, itemId), updatedItem);
  return resp;
};

export const addNewDocument = async (collectionName, itemToAdd) => {
  const resp = await addDoc(collection(db, collectionName), itemToAdd);
  return resp;
};
export const deleteDocument = async (collectionName, itemId) => {
  const resp = await deleteDoc(doc(db, collectionName, itemId));
  return resp;
};

export const getPlaceDocuments = async (col, dbVari, vari) => {
  const q = query(collection(db, col), where(dbVari, "==", vari));

  const querySnapshot = await getDocs(q);

  let docsArr = [];

  querySnapshot.docs.forEach((doc) => {
    docsArr.push({ id: doc.id, ...doc.data() });
  });
  return docsArr;
};

export const getSubCityDocuments = async (col) => {
  const q = query(collection(db, col));

  const querySnapshot = await getDocs(q);

  let docsArr = [];

  querySnapshot.docs.forEach((doc) => {
    docsArr.push({ id: doc.id, ...doc.data() });
  });
  return docsArr;
};
