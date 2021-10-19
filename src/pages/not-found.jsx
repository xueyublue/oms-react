import { Result } from "antd";

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const NotFound = () => {
  return (
    <Result
      status="404"
      title="404"
      subTitle={
        <div>
          <h3>The requested URL was not found on this server.</h3>
          <h4>That's all we know.</h4>
        </div>
      }
    />
  );
};

export default NotFound;
