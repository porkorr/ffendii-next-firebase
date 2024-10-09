"use client";

import { createContext, useState, useEffect } from "react";
import { collection, getDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";

const FirestoreContext = createContext();

const FirestoreProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);
  const [settings, setSettings] = useState([]);
  const [users, setUsers] = useState([]);

  // ดึงข้อมูล sender ทั้งหมดจาก reference
  const fetchSenderData = async (senderRef) => {
    if (!senderRef) return null;
    try {
      const userDoc = await getDoc(senderRef);
      return userDoc.exists()
        ? {
            uid: userDoc.data().uid,
            displayName: userDoc.data().displayName || "Unknown",
            role: userDoc.data().role || null,
            subscription: userDoc.data().subscription || null,
          }
        : null;
    } catch (error) {
      //
      return null;
    }
  };

  // ติดตามการเปลี่ยนแปลงใน sender document และอัปเดต requests
  const subscribeToSenderData = (senderRef, requestId) => {
    if (!senderRef) return;
    return onSnapshot(
      senderRef,
      (userDoc) => {
        if (!userDoc.exists()) return;
        const senderData = {
          uid: userDoc.data().uid,
          displayName: userDoc.data().displayName || "Unknown",
          role: userDoc.data().role || null,
          subscription: userDoc.data().subscription || null,
        };
        setRequests((prevRequests) =>
          prevRequests.map((request) => (request.id === requestId ? { ...request, sender: senderData } : request))
        );
      },
      (error) => {
        //
      }
    );
  };

  // ดึงข้อมูล requests พร้อมข้อมูล sender และติดตามการเปลี่ยนแปลง
  const fetchRequests = async () => {
    try {
      const unsubscribeRequests = onSnapshot(
        query(collection(db, "requests"), orderBy("order", "asc")),
        async (snapshot) => {
          if (snapshot.empty) {
            setRequests([]);
            return;
          }

          const requestsWithSenderData = await Promise.all(
            snapshot.docs.map(async (res) => {
              const data = res.data();
              const senderRef = data.sender; // sender เป็น reference
              const senderData = await fetchSenderData(senderRef);
              return { id: res.id, sender: senderData, ...data };
            })
          );

          setRequests(requestsWithSenderData);

          // ติดตามการเปลี่ยนแปลงของ sender ใน users collection
          requestsWithSenderData.forEach((request) => {
            if (request.sender) {
              subscribeToSenderData(request.sender, request.id);
            }
          });
        },
        (error) => {
          //
        }
      );

      return () => {
        unsubscribeRequests();
      };
    } catch (error) {
      //
    }
  };

  const fetchSettings = async () => {
    try {
      const unsubscribe = onSnapshot(
        query(collection(db, "settings")),
        async (snapshot) => {
          if (snapshot.empty) {
            setSettings([]);
          } else {
            const settings = await Promise.all(
              snapshot.docs.map((doc) => {
                const data = doc.data();

                return {
                  ...data,
                };
              })
            );
            setSettings(settings[0]);
          }
        },
        (error) => {
          //
        }
      );

      return () => unsubscribe();
    } catch (error) {
      //
    }
  };

  const fetchUsers = async () => {
    try {
      const unsubscribe = onSnapshot(
        query(collection(db, "users")),
        async (snapshot) => {
          if (snapshot.empty) {
            setUsers([]);
          } else {
            const usersList = await Promise.all(
              snapshot.docs.map(async (doc) => {
                const data = doc.data();

                return {
                  ...data,
                };
              })
            );
            setUsers(usersList);
          }
        },
        (error) => {
          //
        }
      );

      return () => unsubscribe();
    } catch (error) {
      //
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchSettings();
    fetchUsers();
  }, []);

  return (
    <FirestoreContext.Provider value={{ requests, setRequests, settings, setSettings, users, setUsers }}>
      {children}
    </FirestoreContext.Provider>
  );
};

export { FirestoreProvider, FirestoreContext };
