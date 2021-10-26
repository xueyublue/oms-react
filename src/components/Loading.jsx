import { Spin } from "antd";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const Loading = () => {
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: "110px",
      }}
    >
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default Loading;
