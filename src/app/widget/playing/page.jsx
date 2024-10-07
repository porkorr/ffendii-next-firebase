"use client";

import useFirestore from "@/hooks/useFirestore";
import "@/styles/widget.css";

const WidgetPlayingPage = () => {
  const { requests, settings } = useFirestore();
  function getYouTubeVideoId(url) {
    const regex = /[?&]v=([^&#]*)/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  }

  return (
    <div>
      {settings.widget && (
        <div className="widget-card">
          {requests[0]?.url && getYouTubeVideoId(requests[0]?.url) && (
            <div className="widget-background">
              <img
                src={`http://img.youtube.com/vi/${getYouTubeVideoId(requests[0]?.url)}/maxresdefault.jpg`}
                alt="Thumbnail"
              />
            </div>
          )}
          <div className="widget-content">
            {requests.length !== 0 ? (
              <>
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
              </>
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
