import React from "react";
import { Spin } from "antd";

const Loading = ({ className }) => {
  return (
    <div className={`${className}`}>
      <Spin size="large" />
    </div>
  );
};

export default Loading;
