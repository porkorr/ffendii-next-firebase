"use client";

import { useState, useEffect } from "react";
import { Table, Button, message, Modal } from "antd";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import useFirestore from "@/hooks/useFirestore";
import Loading from "@/components/Loading";

const TableUsers = () => {
  const { users, setUsers } = useFirestore();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isBanAction, setIsBanAction] = useState(true);
  const [loading, setLoading] = useState(true);

  const openModal = (user, isBan) => {
    setSelectedUser(user);
    setIsBanAction(isBan);
    setModalOpen(true);
  };

  const handleModalCancel = () => {
    setModalOpen(false);
  };

  const handleAction = async () => {
    if (!selectedUser) return;

    const userDocRef = doc(db, "users", selectedUser.uid);
    try {
      await updateDoc(userDocRef, { isBanned: isBanAction });
      message.success(`User has been ${isBanAction ? "banned" : "unbanned"}.`);
      setModalOpen(false);
    } catch (error) {
      message.error(`Failed to ${isBanAction ? "ban" : "unban"} user.`);
    }
  };

  const columns = [
    {
      width: 50,
      align: "center",
      title: "No",
      key: "index",
      render: (text, record, index) => <>{index + 1}</>,
    },
    {
      title: "Name",
      dataIndex: "displayName",
      key: "displayName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      width: 100,
      align: "center",
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      width: 100,
      align: "center",
      title: "Action",
      key: "action",
      render: (_, record) => (
        <>
          {record.isBanned ? (
            <Button type="link" onClick={() => openModal(record, false)}>
              Unban
            </Button>
          ) : (
            <Button type="link" danger onClick={() => openModal(record, true)}>
              Ban
            </Button>
          )}
        </>
      ),
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (users) {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [users]);

  if (loading) {
    return <Loading className="loading w-full full mt-[20px]" />;
  }

  return (
    <div className="fade-in">
      <Table
        dataSource={users}
        columns={columns}
        rowKey="uid"
        bordered
        pagination={{
          pageSize: 20,
        }}
        // style={{ minWidth: "500px" }}
      />
      <Modal
        title={isBanAction ? "Ban User" : "Unban User"}
        open={modalOpen}
        onOk={handleAction}
        onCancel={handleModalCancel}
        centered
        okButtonProps={{
          style: {
            background: "linear-gradient(145deg, #d1ff00 0%, #ffd933 100%)",
            border: "none",
            color: "#17191c",
            borderRadius: "5px",
            height: "40px",
            padding: "0 30px",
            fontWeight: "500",
          },
        }}
        cancelButtonProps={{
          style: {
            backgroundColor: "#ffffff",
            borderColor: "#ffffff",
            color: "#17191c",
            borderRadius: "5px",
            height: "40px",
            padding: "0 30px",
            fontWeight: "500",
          },
        }}
      >
        <p>Are you sure you want to {isBanAction ? "ban" : "unban"} this user?</p>
        <p>
          <strong>{selectedUser?.displayName}</strong>
        </p>
      </Modal>
    </div>
  );
};

export default TableUsers;
