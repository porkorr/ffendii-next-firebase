"use client";

import { createContext, useState, useEffect } from "react";
import { collection, getDoc, doc, setDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";
import Loading from "@/components/Loading";

const FirestoreContext = createContext();

const FirestoreProvider = ({ children }) => {
  const [requests, setRequests] = useState(null);
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      const settingsDocRef = doc(db, "settings", "ZH98PetEAQWOpYzFsTJS");

      // ตรวจสอบว่าเอกสาร settings มีอยู่ใน Firestore หรือไม่
      const settingsDoc = await getDoc(settingsDocRef);

      if (!settingsDoc.exists()) {
        // ถ้าเอกสารยังไม่มี ให้สร้างเอกสารใหม่ด้วย ID คงที่
        const defaultSettings = {
          live: true,
          request: true,
          requestCooldown: true,
          requestCooldownSeconds: 180,
          widget: true,
        };

        // ใช้ setDoc เพื่อสร้างเอกสารใหม่
        await setDoc(settingsDocRef, defaultSettings);
        setSettings(defaultSettings); // อัปเดต state ด้วย settings ใหม่
      } else {
        // ถ้ามีเอกสาร settings อยู่แล้ว ให้ใช้งานเอกสารนั้น
        const data = settingsDoc.data();
        setSettings(data); // ตั้งค่า settings จากเอกสารที่มีอยู่
      }

      // ตั้งค่าการติดตามการเปลี่ยนแปลงในเอกสาร settings
      const unsubscribe = onSnapshot(settingsDocRef, (doc) => {
        if (doc.exists()) {
          setSettings(doc.data()); // อัปเดต state เมื่อมีการเปลี่ยนแปลง
        }
      });

      return () => unsubscribe(); // คืนค่าฟังก์ชันสำหรับยกเลิกการติดตาม
    } catch (error) {
      console.error("Error in fetchSettings: ", error);
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
    const fetchData = async () => {
      await Promise.all([fetchRequests(), fetchSettings(), fetchUsers()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <Loading className="loading w-screen h-screen" />;
  }

  return <FirestoreContext.Provider value={{ requests, settings, users }}>{children}</FirestoreContext.Provider>;
};

export { FirestoreProvider, FirestoreContext };
