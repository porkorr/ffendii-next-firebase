"use client";

import { useState, useEffect } from "react";
import { getYouTubeVideoId } from "@/utils/utils";
import useFirestore from "@/hooks/useFirestore";
import "@/styles/widget.css";

const WidgetPlayingPage = () => {
  const { requests, settings } = useFirestore();

  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [isEffectActive, setIsEffectActive] = useState(false);

  useEffect(() => {
    const videoId = getYouTubeVideoId(requests[0]?.url);
    setIsEffectActive(true);
    if (videoId) {
      const newThumbnailUrl = `http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setThumbnailUrl(newThumbnailUrl);
      const timeout = setTimeout(() => {
        setIsEffectActive(false);
      }, 300);

      return () => clearTimeout(timeout);
    } else {
      setThumbnailUrl("");
      const timeout = setTimeout(() => {
        setIsEffectActive(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [requests[0]?.url]);

  return (
    <div>
      {settings.widget && (
        <div className="widget-card">
          {thumbnailUrl && (
            <div className={`widget-background`}>
              <img src={thumbnailUrl} alt="Thumbnail" className={`now-playing ${isEffectActive ? "fade-in" : ""}`} />
            </div>
          )}
          <div className="widget-content">
            {requests.length !== 0 ? (
              <div className={`${isEffectActive ? "opacity-0" : "slide-in"}`}>
                <div className="widget-title">
                  <p>Now playing</p>
                  <div className="dots-wave">
                    <span>.</span>
                    <span>.</span>
                    <span>.</span>
                  </div>
                </div>
                <div className="widget-song-name">
                  <p>{requests[0]?.title}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="widget-song-name">
                  <p>No songs available</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WidgetPlayingPage;
