"use client";

import { HiStatusOnline } from "react-icons/hi";
import { formatDateTime, getYouTubeVideoId } from "@/utils/utils";
import useAuth from "@/hooks/useAuth";
import useFirestore from "@/hooks/useFirestore";
import FormRequest from "@/components/FormRequest";
import Image from "next/image";
import "@/styles/request.css";

const RequestPage = () => {
  const { user } = useAuth();
  const { requests, settings } = useFirestore();

  return (
    <main className="fade-in">
      {settings.live === true ? (
        <div className="request">
          <div className="now-playing">
            {requests[0]?.url && getYouTubeVideoId(requests[0]?.url) && (
              <div className="now-cover">
                <img
                  src={`http://img.youtube.com/vi/${getYouTubeVideoId(requests[0]?.url)}/maxresdefault.jpg`}
                  alt="Thumbnail"
                />
              </div>
            )}
            <div className="now-content">
              <div className="now-badge-live">
                <HiStatusOnline size={20} />
                Live
              </div>
              {requests.length !== 0 ? (
                <>
                  <div className="now-title">
                    <p>Now playing</p>
                    <div className="dots-wave">
                      <span>.</span>
                      <span>.</span>
                      <span>.</span>
                    </div>
                  </div>
                  <div className="now-song-name">
                    <p>{requests[0]?.title}</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="now-song-name">
                    <p>No songs available</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="up-next">
            {requests.length !== 0 ? (
              <div className="next-title">
                <h4>Up Next</h4>
                <p>{requests.length - 1} remaining in queue</p>
              </div>
            ) : (
              <div className="next-empty">
                <p>no song in queue</p>
              </div>
            )}
            <div className="next-requests">
              <div className="list">
                {requests.slice(1).map((request, index) => (
                  <div className={`item`} key={request.id}>
                    <div className="item-order">{index + 1}</div>
                    <div className="item-detail">
                      <div className="title">{request.title}</div>
                      <div className="detail">
                        {/* <div className="delete">
                          {request.sender.uid === user?.uid && user?.role && (
                            <span className="text-[12px]">delete</span>
                          )}
                        </div> */}
                        <div className="sender">
                          {request.sender.role === "admin" && (
                            <span className="text-[#ffd933]">{request.sender.displayName}</span>
                          )}
                          {request.sender.role === "user" && (
                            <span className="text-[#ffffff]">{request.sender.displayName}</span>
                          )}
                          <div className="time">{formatDateTime(request.createdAt)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="send">
                <div className="title">
                  <h2>Add song to queue</h2>
                </div>
                <FormRequest isBlurForm={!user?.role || !settings.request ? false : true} />
                {(!user?.role || !settings.request || user?.isBanned === true) && (
                  <div className="close-request">
                    <Image
                      className="image-overlay"
                      src="/images/DSC07358.png"
                      alt="Picture of the author"
                      width={250}
                      height={333}
                    />
                    {!user?.role ? (
                      <>
                        <p>
                          Please <a href="/login">log in</a> to request a song!
                        </p>
                        <p>
                          If you don’t have an account yet, feel free to <a href="/register">register</a> and join the
                          fun!
                        </p>
                      </>
                    ) : user?.isBanned === true ? (
                      <p>
                        It seems your account has been restricted due to <font className="text-danger">disruptive</font>{" "}
                        or <font className="text-danger">toxic</font> behavior. Please reach out to support if you have
                        any questions.
                      </p>
                    ) : (
                      <p>The song request feature is currently closed, but we'll be back for more fun next time!</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="request-offline">
          <h2>ffendii is offline.</h2>
          <p>I'll be back online soon!</p>
        </div>
      )}
    </main>
  );
};

export default RequestPage;
