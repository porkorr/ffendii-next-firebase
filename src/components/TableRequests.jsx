"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { Button, Table, Modal, Input, message } from "antd";
import { CgMenuGridO } from "react-icons/cg";
import { AiFillEdit } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import useFirestore from "@/hooks/useFirestore";
import Loading from "@/components/Loading";

const RowContext = createContext({});

const TableRequestList = () => {
  const { requests, setRequests } = useFirestore();
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [requestToDelete, setRequestToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const columns = [
    {
      width: 20,
      align: "center",
      key: "index",
      render: () => <DragHandle />,
    },
    {
      width: 20,
      align: "center",
      title: "No",
      width: "50px",
      render: (text, record) => <>{record.order}</>,
    },
    {
      title: "Title",
      render: (text, record) => <>{record.title}</>,
    },
    {
      width: 100,
      title: "URL",
      render: (text, record) => (
        <a
          href={record.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ffffff", textDecoration: "underline" }}
        >
          {record.url}
        </a>
      ),
    },
    {
      title: "Message",
      render: (text, record) => <>{record.message}</>,
    },
    {
      width: 100,
      title: "Sender",
      render: (text, record) => <>{record.sender.displayName}</>,
    },
    {
      width: 100,
      align: "center",
      title: "Action",
      render: (text, record) => (
        <>
          <Button
            type="text"
            icon={<AiFillEdit size={18} />}
            onClick={() => handleEditSelect(record)}
            style={{ color: "#ffd933" }}
            // variant="link"
          >
            {/* edit */}
          </Button>
          <Button
            type="text"
            icon={<RiDeleteBin6Line size={18} />}
            onClick={() => handleDeleteSelect(record)}
            style={{ color: "#ff205f" }}
            // variant="link"
          >
            {/* delete */}
          </Button>
        </>
      ),
    },
  ];

  const DragHandle = () => {
    const { setActivatorNodeRef, listeners } = useContext(RowContext);

    return (
      <Button
        type="text"
        size="small"
        icon={<CgMenuGridO size={18} />}
        style={{ cursor: "move", color: "#ffffff" }}
        ref={setActivatorNodeRef}
        {...listeners}
      />
    );
  };

  const Row = (props) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
      id: props["data-row-key"],
    });

    const style = {
      ...props.style,
      transform: CSS.Translate.toString(transform),
      transition,
      ...(isDragging ? { position: "relative", zIndex: 9999 } : {}),
    };

    const contextValue = useMemo(() => ({ setActivatorNodeRef, listeners }), [setActivatorNodeRef, listeners]);

    return (
      <RowContext.Provider value={contextValue}>
        <tr {...props} ref={setNodeRef} style={style} {...attributes} />
      </RowContext.Provider>
    );
  };

  const onDragEnd = ({ active, over }) => {
    if (active.id !== over?.id) {
      setRequests((prevState) => {
        const activeItem = prevState.find((record) => record.id === active.id);
        const overItem = prevState.find((record) => record.id === over.id);

        if (!activeItem || !overItem) {
          return prevState;
        }

        const activeIndex = prevState.indexOf(activeItem);
        const overIndex = prevState.indexOf(overItem);

        const newRequests = [...prevState];
        newRequests.splice(activeIndex, 1);
        newRequests.splice(overIndex, 0, activeItem);

        const updatedRequests = newRequests.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        updatedRequests.forEach(async (request) => {
          try {
            await updateDoc(doc(db, "requests", request.id), { order: request.order });
          } catch (error) {
            //
          }
        });

        return updatedRequests;
      });
    }
  };

  ///

  const handleEditSelect = (request) => {
    setRequestToEdit(request);
    setModalEditOpen(true);
  };

  const handleEditCancel = () => {
    setModalEditOpen(false);
  };

  const handleEditRequest = async () => {
    const { id, title, url } = requestToEdit;

    try {
      await updateDoc(doc(db, "requests", id), {
        title,
        url,
        updatedAt: new Date(),
      });
      message.success("Edited");
    } catch (error) {
      //
    }

    setModalEditOpen(false);
  };

  ///

  const handleDeleteSelect = (request) => {
    setRequestToDelete(request);
    setModalDeleteOpen(true);
  };

  const handleDeleteCancel = () => {
    setModalDeleteOpen(false);
  };

  const handleDeleteRequest = async () => {
    if (requestToDelete) {
      try {
        const requestDocRef = doc(db, "requests", requestToDelete.id);
        await deleteDoc(requestDocRef)
          .then(() => {
            setRequests((prevState) => {
              const remainingRequests = prevState.filter((request) => request.id !== requestToDelete.id);
              const reorderedRequests = remainingRequests.map((item, index) => ({
                ...item,
                order: index + 1,
              }));

              reorderedRequests.map(async (item, index) => {
                try {
                  await updateDoc(doc(db, "requests", item.id), { order: item.order });
                } catch (error) {
                  //
                }
              });

              return reorderedRequests;
            });
            message.success("Deleted!");
            setModalDeleteOpen(false);
          })
          .catch((error) => {
            //
          });
      } catch (error) {
        //
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (requests) {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [requests]);

  if (loading) {
    return <Loading className="loading w-full full mt-[20px]" />;
  }

  return (
    <div className="fade-in">
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext items={requests.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          <Table
            dataSource={requests}
            columns={columns}
            rowKey={(record) => record.id}
            components={{
              body: {
                row: Row,
              },
            }}
            pagination={false}
            bordered
            // style={{ minWidth: "1000px" }}
          />
        </SortableContext>
      </DndContext>
      <Modal
        title="Edit Song"
        open={modalEditOpen}
        onOk={handleEditRequest}
        onCancel={handleEditCancel}
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
          },
        }}
      >
        <Input
          placeholder="Song Name"
          size="large"
          className="h-[50px]"
          value={requestToEdit?.title}
          onChange={(e) => setRequestToEdit({ ...requestToEdit, title: e.target.value })}
        />
        <Input
          placeholder="URL"
          size="large"
          className="h-[50px]"
          value={requestToEdit?.url}
          onChange={(e) => setRequestToEdit({ ...requestToEdit, url: e.target.value })}
          style={{ marginTop: 10 }}
        />
      </Modal>
      <Modal
        title="Delete Song"
        open={modalDeleteOpen}
        onOk={handleDeleteRequest}
        onCancel={handleDeleteCancel}
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
        <p>{requestToDelete?.title}</p>
      </Modal>
    </div>
  );
};

export default TableRequestList;
